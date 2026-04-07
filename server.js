import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'
import cookieParser from 'cookie-parser'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const SITE_URL = 'https://doitbetter.up.railway.app'

// Read the built HTML template once at startup
let htmlTemplate = ''
try { htmlTemplate = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8') } catch {}

function injectSEO(html, { title, description, url, type = 'article', structuredData }) {
  let out = html
  // Replace title
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  // Replace meta description
  out = out.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
  // Replace canonical
  out = out.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
  // Replace OG tags
  out = out.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
  out = out.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`)
  out = out.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
  out = out.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${type}"`)
  // Replace Twitter tags
  out = out.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`)
  out = out.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`)
  // Inject Article structured data before closing </head>
  if (structuredData) {
    out = out.replace('</head>', `<script type="application/ld+json">\n${JSON.stringify(structuredData)}\n</script>\n</head>`)
  }
  return out
}

// ── Supabase server client (service role — bypasses RLS) ─────────────────────
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null

// ── IP enrichment cache (in-memory, 24hr TTL) ───────────────────────────────
const ipCache = new Map()
const IP_CACHE_TTL = 24 * 60 * 60 * 1000

async function enrichIP(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return {}
  const cached = ipCache.get(ip)
  if (cached && Date.now() - cached.ts < IP_CACHE_TTL) return cached.data
  try {
    const token = process.env.IPINFO_TOKEN
    if (!token) return {}
    const res = await fetch(`https://ipinfo.io/${ip}?token=${token}`)
    if (!res.ok) return {}
    const data = await res.json()
    const enriched = {
      city: data.city || null,
      region: data.region || null,
      country: data.country || null,
      company: data.org || null,
      isp: data.org || null,
    }
    ipCache.set(ip, { data: enriched, ts: Date.now() })
    return enriched
  } catch { return {} }
}

// ── Slack webhook for high-value visitor alerts ─────────────────────────────
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
const HIGH_VALUE_PAGES = ['/solutions/', '/build', '/contact']
const ISP_KEYWORDS = /comcast|spectrum|verizon|at.t|t-mobile|cox|charter|xfinity|centurylink|frontier|windstream|optimum|mediacom|suddenlink|residential/i

async function sendSlackAlert(visitor) {
  if (!SLACK_WEBHOOK_URL) return
  const isHighValue = HIGH_VALUE_PAGES.some(p => visitor.first_page.startsWith(p))
  const isBusiness = visitor.company && !ISP_KEYWORDS.test(visitor.company)

  // Only alert for business visitors OR high-value page visits
  if (!isBusiness && !isHighValue) return

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: isBusiness ? '🏢 Business Visitor' : '👀 High-Value Page Visit' }
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Company:*\n${visitor.company || 'Unknown (residential)'}` },
        { type: 'mrkdwn', text: `*Page:*\n${visitor.first_page}` },
        { type: 'mrkdwn', text: `*Location:*\n${[visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ')}` },
        { type: 'mrkdwn', text: `*Referrer:*\n${visitor.referrer || 'Direct'}` },
      ]
    }
  ]

  if (visitor.utm_source) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `UTM: ${visitor.utm_source}/${visitor.utm_medium || '—'}/${visitor.utm_campaign || '—'}` }]
    })
  }

  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
  } catch (err) {
    console.error('[slack-alert]', err.message)
  }
}

async function logVisitor(sessionId, ip, req, query) {
  if (!supabase) return
  try {
    const enriched = await enrichIP(ip)
    const visitor = {
      session_id: sessionId,
      ip,
      user_agent: req.headers['user-agent'] || null,
      referrer: req.headers['referer'] || null,
      utm_source: query.get('utm_source') || null,
      utm_medium: query.get('utm_medium') || null,
      utm_campaign: query.get('utm_campaign') || null,
      utm_content: query.get('utm_content') || null,
      utm_term: query.get('utm_term') || null,
      first_page: req.path,
      ...enriched,
    }
    await supabase.from('visitors').insert(visitor)

    // Fire Slack alert in background (don't block response)
    sendSlackAlert(visitor)
  } catch (err) {
    console.error('[visitor-log]', err.message)
  }
}

// ── Probe/scanner path blocking ─────────────────────────────────────────────
// Return 404 for paths that vulnerability scanners probe — don't waste bandwidth
// serving the full SPA HTML and don't pollute visitor logs
const PROBE_PATTERNS = /\.(env|yml|yaml|log|bak|old|php|sql|conf|ini|cfg|config)$|\/\.(?:env|aws|git|svn|vscode|bitbucket)|\/(?:wp-admin|wp-json|wp-config|wp-login|xmlrpc|actuator|telescope|_profiler|console|phpinfo|info\.php|debug|server-status|\.well-known\/security)/i

app.use((req, res, next) => {
  if (PROBE_PATTERNS.test(req.path) && !req.path.startsWith('/api/') && req.path !== '/robots.txt') {
    return res.status(404).end()
  }
  next()
})

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cookieParser())
app.use(express.json())

// Visitor logging middleware — runs on HTML page requests only
app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || ''
  if (req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|map|json)$/) || req.path.startsWith('/api/') || /bot|crawler|spider|scan|healthcheck|uptime|monitoring|pingdom|statuspage|leakix|semrush|ahrefs|mj12bot|dotbot|petalbot/i.test(ua)) {
    return next()
  }

  let sessionId = req.cookies?.visitor_session
  let isNewSession = false
  if (!sessionId) {
    sessionId = uuidv4()
    isNewSession = true
    res.cookie('visitor_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  }

  if (isNewSession) {
    const query = new URL(req.url, `http://${req.headers.host}`).searchParams
    logVisitor(sessionId, (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(), req, query)
  }

  next()
})

app.use(express.static(join(__dirname, 'dist')))

// ── Event tracking endpoint ──────────────────────────────────────────────────
app.post('/api/track', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Tracking not configured' })

  const { session_id, event_type, page_path, event_data } = req.body
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' })
  if (!event_type) return res.status(400).json({ error: 'Missing event_type' })

  // If this is the first event for this session, log the visitor too
  try {
    const { count } = await supabase.from('visitors').select('id', { count: 'exact', head: true }).eq('session_id', session_id)
    if (count === 0) {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
      const enriched = await enrichIP(ip)
      const ed = event_data || {}
      await supabase.from('visitors').insert({
        session_id,
        ip,
        user_agent: req.headers['user-agent'] || null,
        referrer: ed.referrer || req.headers['referer'] || null,
        utm_source: ed.utm_source || null,
        utm_medium: ed.utm_medium || null,
        utm_campaign: ed.utm_campaign || null,
        utm_content: ed.utm_content || null,
        utm_term: ed.utm_term || null,
        first_page: page_path,
        ...enriched,
      })
    }
  } catch (err) {
    console.error('[visitor-check]', err.message)
  }

  try {
    await supabase.from('visitor_events').insert({
      session_id,
      event_type,
      page_path: page_path || null,
      event_data: event_data || {},
    })
  } catch (err) {
    console.error('[track]', err.message)
  }

  res.status(204).end()
})

// ── Blog CMS Admin Auth ─────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'doitbetter2024'

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// ── Blog API (public) ───────────────────────────────────────────────────────
app.get('/api/blog', async (req, res) => {
  if (!supabase) return res.json([])
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, tags, read_time, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data || [])
})

app.get('/api/blog/:slug', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Not configured' })
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('status', 'published')
    .single()
  if (error || !data) return res.status(404).json({ error: 'Post not found' })
  res.json(data)
})

// ── Blog Admin API ──────────────────────────────────────────────────────────
app.get('/api/admin/blog', requireAdmin, async (req, res) => {
  if (!supabase) return res.json([])
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, status, excerpt, tags, read_time, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data || [])
})

app.post('/api/admin/blog', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Not configured' })
  const { slug, title, excerpt, meta_description, content, tags, read_time, status } = req.body
  const isPublished = status === 'published'
  const { data, error } = await supabase.from('blog_posts').insert({
    slug, title, excerpt, meta_description, content, tags,
    read_time: read_time || '5 min read',
    status: status || 'draft',
    published_at: isPublished ? new Date().toISOString() : null,
  }).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

app.put('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Not configured' })
  const updates = { ...req.body, updated_at: new Date().toISOString() }
  if (updates.status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString()
  }
  delete updates.id
  delete updates.created_at
  const { data, error } = await supabase.from('blog_posts')
    .update(updates).eq('id', req.params.id).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Not configured' })
  const { error } = await supabase.from('blog_posts').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

// ── Blog AI Generation ──────────────────────────────────────────────────────
app.post('/api/admin/blog/ai-generate', requireAdmin, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const { topic } = req.body
  if (!topic) return res.status(400).json({ error: 'Topic is required' })

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: `You are a blog writer for doITbetter labs, a custom software development agency that uses AI-accelerated (Claude-enabled) workflows to build software faster and cheaper for small and mid-size businesses. The tone is direct, practical, no fluff — written for business owners, not developers.

Write a complete blog post about: ${topic}

The post should:
- Be 800-1200 words
- Have 4-5 sections with headings
- Reference doITbetter labs and how our Claude-enabled development approach relates to the topic
- Include a lead-capture block roughly 2/3 through the post
- Be practical and actionable, not generic or salesy
- Reference real companies, trends, or data points where relevant

Return a JSON object with EXACTLY this structure (no markdown fences, just valid JSON):
{
  "title": "Compelling blog post title",
  "slug": "url-friendly-slug",
  "excerpt": "1-2 sentence summary for the blog index card",
  "meta_description": "SEO meta description under 160 chars",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "read_time": "5 min read",
  "content": [
    { "type": "paragraph", "text": "Opening paragraph text. Use <strong>bold</strong> and <em>italic</em> for emphasis." },
    { "type": "heading", "text": "Section Heading" },
    { "type": "paragraph", "text": "More text..." },
    { "type": "highlight", "text": "A key stat or callout." },
    { "type": "list", "items": ["Point one", "Point two", "Point three"] },
    { "type": "lead-capture" },
    { "type": "heading", "text": "Another Section" },
    { "type": "paragraph", "text": "More content..." }
  ]
}

Rules for content blocks:
- "paragraph": text with optional inline HTML (<strong>, <em>, <a href="..." target="_blank" rel="noopener noreferrer">)
- "heading": plain text, rendered as h2
- "highlight": a key stat or important callout, rendered with accent color
- "list": array of string items with optional inline HTML
- "lead-capture": no text needed, renders an email capture form` }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock) return res.status(500).json({ error: 'No response from AI' })

    let jsonText = textBlock.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    const generated = JSON.parse(jsonText)
    res.json(generated)
  } catch (err) {
    console.error('[blog-ai-generate]', err.message)
    res.status(500).json({ error: 'Failed to generate blog post', detail: err.message })
  }
})

app.post('/api/admin/blog/ai-edit', requireAdmin, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const { content, instruction } = req.body
  if (!content || !instruction) return res.status(400).json({ error: 'Content and instruction required' })

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: `You are editing a blog post for doITbetter labs, a custom software development agency. The tone is direct, practical, no fluff — written for business owners.

Here is the current blog post content as a JSON array of blocks:
${JSON.stringify(content, null, 2)}

Apply this edit instruction: ${instruction}

Return ONLY the updated content array (same JSON block format), no explanation. Keep the same block types: paragraph, heading, highlight, list, lead-capture. Preserve any existing lead-capture blocks.` }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock) return res.status(500).json({ error: 'No response from AI' })

    let jsonText = textBlock.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    const updated = JSON.parse(jsonText)
    res.json(updated)
  } catch (err) {
    console.error('[blog-ai-edit]', err.message)
    res.status(500).json({ error: 'Failed to edit content', detail: err.message })
  }
})

// ── Claude API endpoint for Build Preview ────────────────────────────────────
app.post('/api/generate-preview', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const { businessName, industry, primaryColor, accentColor, description, customers, services } = req.body

  if (!businessName || !description) {
    return res.status(400).json({ error: 'Business name and description are required' })
  }

  try {
    const client = new Anthropic({ apiKey })

    const prompt = `You are a senior web developer and business consultant at a software agency. A potential client just described their project. Based on their input, generate a comprehensive project analysis.

CLIENT INPUT:
- Business Name: ${businessName}
- Industry: ${industry}
- Primary Color: ${primaryColor}
- Accent Color: ${accentColor}
- What they need: ${description}
- Their customers: ${customers}
- Their services/offerings: ${services}

Generate a JSON response with EXACTLY this structure (no markdown, no code fences, just valid JSON):

{
  "tagline": "A compelling one-line tagline for their business (8-12 words max)",
  "heroSubheadline": "A 1-2 sentence value proposition for their website hero section",
  "aboutBlurb": "A 2-3 sentence about section that positions their business compellingly",
  "serviceCards": [
    {"name": "Service Name", "description": "One compelling sentence about this service"}
  ],
  "projectType": "website|webapp|mobile|integration",
  "projectTypeLabel": "Standalone Website|Web Application|Native Mobile App|Integration Platform",
  "estimatedRange": "$999/yr|$2K-$8K|$5K-$15K|$10K-$30K+|$3K-$12K",
  "recommendation": "2-3 sentences explaining why this project type is the right fit for what they described. Reference their specific business, customers, and needs. Be direct and specific, not generic.",
  "technicalConsiderations": [
    {"title": "Consideration Title", "detail": "A realistic technical detail sentence about how this would be implemented for their specific use case", "questions": ["A specific discovery question we would ask the client about this topic", "A second question drilling into their current setup or requirements"]}
  ],
  "ctaText": "A compelling call-to-action button text (3-5 words)",
  "secondaryCta": "A secondary action text (e.g. 'View Our Menu', 'See Our Work', 'Learn More')",
  "layoutStyle": "bold|elegant|clean|warm",
  "heroStyle": "gradient|split|centered|fullwidth",
  "navStyle": "transparent|solid|minimal",
  "testimonial": {"quote": "A realistic-sounding customer testimonial for this type of business", "author": "A realistic first name and last initial", "role": "Customer title like 'Regular Customer' or 'Client since 2023'"},
  "stats": [
    {"value": "A realistic metric", "label": "Short label"}
  ],
  "featureHighlight": "One standout feature or differentiator for the hero area (e.g. 'Free Delivery on Orders Over $30', 'No Contracts Ever', 'Licensed & Insured')"
}

Rules:
- serviceCards should have 3-6 items based on what they listed, rewritten to sound professional
- technicalConsiderations should have 6-8 items relevant to their project type
- For websites: include SEO, responsive design, analytics, lead capture, content strategy, hosting
- For web apps: add authentication, data architecture, API integration, notification system
- For mobile: add platform strategy, push notifications, offline capability, app store
- Each technicalConsideration MUST include a "questions" array with 3-4 questions. IMPORTANT ordering: the first 1-2 questions should be obvious, common-sense questions anyone would ask ("Do you have a logo?", "What's your current website URL?", "How do customers contact you today?"). These are UNBLURRED and show the client we're approachable and practical. The last 2 questions should be deeper, more technical discovery questions that show real expertise ("Which POS system do you use so we can plan the integration?", "What's your average order volume during peak hours?"). These deeper ones get blurred to drive the consultation. Mark the obvious ones by starting them with "[visible] " prefix and the deeper ones with "[deep] " prefix.
- The recommendation must reference their SPECIFIC business and customers, not be generic
- The tagline should feel custom to their brand, not a template
- All text should be professional but approachable — not salesy or buzzwordy
- layoutStyle: "bold" for fitness/sports/energy brands, "elegant" for professional services/luxury, "clean" for tech/saas/modern, "warm" for food/family/community businesses
- heroStyle: "gradient" uses brand color gradient background, "split" puts text left and a colored block right, "centered" is minimal centered text on white, "fullwidth" is big bold text edge to edge
- navStyle: "transparent" overlays on hero, "solid" is white with shadow, "minimal" is just logo and hamburger
- stats should have exactly 3-4 items with realistic numbers for this specific industry (e.g. restaurant: "500+ Orders/Week", gym: "200+ Members")
- The testimonial should sound authentic for this industry, not generic`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock) {
      return res.status(500).json({ error: 'No response from AI' })
    }

    // Parse the JSON response — strip markdown fences if present
    let jsonText = textBlock.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    try {
      const generated = JSON.parse(jsonText)
      res.json(generated)
    } catch (parseErr) {
      console.error('[generate-preview] JSON parse failed:', parseErr.message)
      console.error('[generate-preview] Raw response:', jsonText.substring(0, 500))
      res.status(500).json({ error: 'Failed to parse AI response' })
    }
  } catch (err) {
    console.error('[generate-preview] API error:', err.status, err.message || err)
    res.status(500).json({ error: 'Failed to generate preview', detail: err.message })
  }
})

// ── Dynamic sitemap ─────────────────────────────────────────────────────────
app.get('/sitemap.xml', async (req, res) => {
  const staticPages = [
    '', '/solutions/case-management', '/solutions/small-business',
    '/solutions/white-glove', '/solutions/franchise', '/solutions/websites',
    '/build', '/blog', '/privacy',
    '/blog/custom-software-cost', '/blog/build-vs-buy',
    '/blog/ai-accelerated-development', '/blog/franchise-software-signs',
    '/blog/high-code-low-code-ai', '/blog/ai-trust-gap',
    '/blog/ai-cost-collapse', '/blog/ai-agents-guide',
  ]

  let dynamicSlugs = []
  if (supabase) {
    const { data } = await supabase.from('blog_posts')
      .select('slug, updated_at').eq('status', 'published')
    dynamicSlugs = (data || []).map(p => ({
      path: `/blog/${p.slug}`,
      updated: p.updated_at?.split('T')[0],
    }))
  }

  const urls = staticPages.map(p => `  <url>
    <loc>${SITE_URL}${p}/</loc>
    <changefreq>${p === '' ? 'weekly' : p === '/blog' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '' ? '1.0' : p.startsWith('/blog') ? '0.7' : '0.9'}</priority>
  </url>`).join('\n')

  const dynamicUrls = dynamicSlugs.map(p => `  <url>
    <loc>${SITE_URL}${p.path}/</loc>
    <lastmod>${p.updated || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')

  res.set('Content-Type', 'application/xml')
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${dynamicUrls}
</urlset>`)
})

// ── SPA fallback with SEO injection for blog posts ──────────────────────────
app.get('*', async (req, res) => {
  const html = htmlTemplate || readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8')

  // Dynamic blog post — inject real meta tags for crawlers
  const blogMatch = req.path.match(/^\/blog\/([a-z0-9-]+)\/?$/)
  if (blogMatch && supabase) {
    const slug = blogMatch[1]
    const { data: post } = await supabase.from('blog_posts')
      .select('title, excerpt, meta_description, slug, published_at, content, tags')
      .eq('slug', slug).eq('status', 'published').single()

    if (post) {
      const title = `${post.title} | doITbetter labs`
      const description = post.meta_description || post.excerpt
      const url = `${SITE_URL}/blog/${post.slug}`

      // Extract plain text from first few content blocks for article body
      const bodyText = (post.content || [])
        .filter(b => b.type === 'paragraph')
        .slice(0, 3)
        .map(b => (b.text || '').replace(/<[^>]*>/g, ''))
        .join(' ')

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": description,
        "url": url,
        "datePublished": post.published_at,
        "dateModified": post.published_at,
        "author": { "@type": "Organization", "name": "doITbetter labs", "url": SITE_URL },
        "publisher": { "@type": "Organization", "name": "doITbetter labs", "url": SITE_URL },
        "mainEntityOfPage": url,
        "keywords": (post.tags || []).join(', '),
        "articleBody": bodyText.substring(0, 500),
      }

      return res.send(injectSEO(html, { title, description, url, structuredData }))
    }
  }

  res.send(html)
})

app.listen(PORT, () => {
  console.log(`doITbetter labs running on port ${PORT}`)
  console.log(`Visitor tracking: ${supabase ? 'ENABLED' : 'DISABLED (missing SUPABASE_URL or SUPABASE_SERVICE_KEY)'}`)
  console.log(`IP enrichment: ${process.env.IPINFO_TOKEN ? 'ENABLED' : 'DISABLED (missing IPINFO_TOKEN)'}`)
  console.log(`Slack alerts: ${SLACK_WEBHOOK_URL ? 'ENABLED' : 'DISABLED (missing SLACK_WEBHOOK_URL)'}`)
})
