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
const SITE_URL = 'https://doitbetterlabs.com'

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

// Companies that are always bots/infrastructure — never alert
const BOT_COMPANIES = /cloudflare|amazon\.com|amazon tech|aws|google|microsoft|digitalocean|linode|vultr|hetzner|ovh|oracle|akamai|fastly|rackspace|ibm|heroku|railway|netlify|vercel|render|fly\.io|github|gitlab|bitbucket|semrush|ahrefs|moz\.com|hubspot|datadog|newrelic|pingdom|uptimerobot|statuspage|imaqliq|data-center/i

// Residential ISPs — not identifiable, don't alert
const ISP_KEYWORDS = /comcast|spectrum|verizon|at.t|t-mobile|cox|charter|xfinity|centurylink|frontier|windstream|optimum|mediacom|suddenlink|residential|cable|telecom|broadband|wireless|mobile|cellular/i

// Pages that signal real buying intent
const INTENT_PAGES = ['/solutions/', '/build', '/get-quote', '/blog/custom-software-cost', '/blog/build-vs-buy']

// Track which sessions we've already alerted on
const alertedSessions = new Set()

// Pending sessions waiting for enough signal before alerting
// Map<sessionId, { timer, events[], visitor }>
const pendingSessions = new Map()

function isRealBusiness(company) {
  if (!company) return false
  if (BOT_COMPANIES.test(company)) return false
  if (ISP_KEYWORDS.test(company)) return false
  return true
}

function evaluateSession(sessionId) {
  const session = pendingSessions.get(sessionId)
  if (!session || alertedSessions.has(sessionId)) return

  const { visitor, events } = session
  if (!visitor) return
  const isBusiness = isRealBusiness(visitor.company)
  const pages = [...new Set(events.filter(e => e.event_type === 'page_view').map(e => e.page_path))]
  const hasIntentPage = pages.some(p => INTENT_PAGES.some(ip => p.startsWith(ip)))
  const hasFormEvent = events.some(e => e.event_type === 'form_start' || e.event_type === 'form_submit')
  const hasDeepScroll = events.some(e => e.event_type === 'scroll_depth' && e.event_data?.depth >= 75)
  const ctaClicks = events.filter(e => e.event_type === 'cta_click')

  // Score the session
  let score = 0
  let reasons = []
  if (isBusiness) { score += 3; reasons.push('identified business') }
  if (hasIntentPage) { score += 3; reasons.push('viewed intent page') }
  if (pages.length >= 2) { score += 2; reasons.push(`${pages.length} pages`) }
  if (hasFormEvent) { score += 4; reasons.push('interacted with form') }
  if (hasDeepScroll) { score += 1; reasons.push('deep scroll') }
  if (ctaClicks.length > 0) { score += 2; reasons.push(`${ctaClicks.length} CTA click(s)`) }
  if (visitor.utm_source) { score += 1; reasons.push('came from campaign') }
  if (visitor.referrer && !visitor.referrer.includes('doitbetterlabs.com')) { score += 1; reasons.push('external referrer') }

  // Only alert if score >= 4 (real engagement, not a drive-by)
  if (score < 4) return

  alertedSessions.add(sessionId)
  pendingSessions.delete(sessionId)
  sendSlackAlert(visitor, events, pages, reasons, score)
}

async function sendSlackAlert(visitor, events, pages, reasons, score) {
  if (!SLACK_WEBHOOK_URL) return

  const journey = pages.map((p, i) => `${i + 1}. ${p}`).join('\n')
  const ctaClicks = events.filter(e => e.event_type === 'cta_click').map(e => e.event_data?.cta).filter(Boolean)
  const formEvents = events.filter(e => e.event_type === 'form_start' || e.event_type === 'form_submit')
  const scoreEmoji = score >= 8 ? '🔥' : score >= 6 ? '⭐' : '👀'

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${scoreEmoji} Engaged Visitor (score: ${score})` }
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Company:*\n${visitor.company || '_Unknown_'}` },
        { type: 'mrkdwn', text: `*Location:*\n${[visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ') || '_Unknown_'}` },
        { type: 'mrkdwn', text: `*Referrer:*\n${visitor.referrer || 'Direct'}` },
        { type: 'mrkdwn', text: `*Why alerting:*\n${reasons.join(', ')}` },
      ]
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*Page journey:*\n${journey}` }
    }
  ]

  if (ctaClicks.length > 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*CTA clicks:* ${ctaClicks.join(', ')}` }
    })
  }

  if (formEvents.length > 0) {
    const formSummary = formEvents.map(e => `${e.event_type === 'form_submit' ? '✅ Submitted' : '✏️ Started'}: ${e.event_data?.form || 'form'}`).join('\n')
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Form activity:*\n${formSummary}` }
    })
  }

  if (visitor.utm_source) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `UTM: ${visitor.utm_source} / ${visitor.utm_medium || '—'} / ${visitor.utm_campaign || '—'}` }]
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

// Called from /api/track — accumulates events and evaluates after a delay
function trackSessionEvent(sessionId, event, visitor) {
  if (!SLACK_WEBHOOK_URL || alertedSessions.has(sessionId)) return

  let session = pendingSessions.get(sessionId)
  if (!session) {
    session = { visitor, events: [], timer: null }
    pendingSessions.set(sessionId, session)
  }
  if (visitor) session.visitor = { ...session.visitor, ...visitor }
  session.events.push(event)

  // Re-evaluate on every event; also set a 2-min timeout to catch
  // sessions that are "good enough" even if no more events come in
  evaluateSession(sessionId)
  clearTimeout(session.timer)
  session.timer = setTimeout(() => {
    evaluateSession(sessionId)
    pendingSessions.delete(sessionId) // clean up either way
  }, 2 * 60 * 1000)
}

// Clean up stale pending sessions every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000
  for (const [id, s] of pendingSessions) {
    if (s.events.length && s.events[s.events.length - 1]._ts < cutoff) {
      pendingSessions.delete(id)
    }
  }
  // Cap alertedSessions memory (keep last 5000)
  if (alertedSessions.size > 5000) {
    const iter = alertedSessions.values()
    for (let i = 0; i < 2500; i++) { alertedSessions.delete(iter.next().value) }
  }
}, 10 * 60 * 1000)

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

    // Seed the session tracker with visitor info (alert fires later based on behavior)
    trackSessionEvent(sessionId, { event_type: 'page_view', page_path: req.path, event_data: {}, _ts: Date.now() }, visitor)
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

// ── Email verification for Build Preview ────────────────────────────────────
const verificationCodes = new Map() // email → { code, expires }

app.post('/api/send-verification', async (req, res) => {
  const { email } = req.body
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })

  const code = String(Math.floor(100000 + Math.random() * 900000)) // 6-digit
  verificationCodes.set(email.toLowerCase(), { code, expires: Date.now() + 10 * 60 * 1000 }) // 10 min TTL

  // Send via EmailJS REST API (uses existing service)
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_xzp77wo',
        template_id: 'template_cmthcco',
        user_id: 'sKxPbJbb8JutpwYcg',
        template_params: {
          from_name: 'doITbetter labs',
          from_email: email,
          message: `Your verification code is: ${code}\n\nEnter this code on the Build Preview page to generate your custom site preview.\n\nThis code expires in 10 minutes.`,
          source: 'Email Verification',
        },
      }),
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[verify-send]', err.message)
    res.status(500).json({ error: 'Failed to send verification email' })
  }
})

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' })

  const entry = verificationCodes.get(email.toLowerCase())
  if (!entry) return res.status(400).json({ error: 'No code found. Request a new one.' })
  if (Date.now() > entry.expires) {
    verificationCodes.delete(email.toLowerCase())
    return res.status(400).json({ error: 'Code expired. Request a new one.' })
  }
  if (entry.code !== code.trim()) return res.status(400).json({ error: 'Invalid code' })

  verificationCodes.delete(email.toLowerCase())
  res.json({ verified: true })
})

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [email, entry] of verificationCodes) {
    if (now > entry.expires) verificationCodes.delete(email)
  }
}, 5 * 60 * 1000)

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

  // Feed event into Slack alert system
  trackSessionEvent(session_id, { event_type, page_path, event_data: event_data || {}, _ts: Date.now() }, null)

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
    .select('id, slug, title, status, excerpt, tags, read_time, published_at, scheduled_at, created_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data || [])
})

app.post('/api/admin/blog', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Not configured' })
  const { slug, title, excerpt, meta_description, content, tags, read_time, status, scheduled_at } = req.body
  const isPublished = status === 'published'
  const isScheduled = status === 'scheduled' && scheduled_at
  const { data, error } = await supabase.from('blog_posts').insert({
    slug, title, excerpt, meta_description, content, tags,
    read_time: read_time || '5 min read',
    status: isScheduled ? 'scheduled' : (status || 'draft'),
    scheduled_at: isScheduled ? scheduled_at : null,
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

  const { businessName, industry, primaryColor, accentColor, description, customers, services, logoUrl, mood, inspirationUrl } = req.body

  if (!businessName || !description) {
    return res.status(400).json({ error: 'Business name and description are required' })
  }

  try {
    const client = new Anthropic({ apiKey })

    const prompt = `You are a senior web developer, designer, and business consultant at a top creative agency. A potential client just described their project. Based on their input, generate a comprehensive project analysis with a DISTINCTIVE, non-generic design direction.

CLIENT INPUT:
- Business Name: ${businessName}
- Industry: ${industry}
- Primary Color: ${primaryColor}
- Accent Color: ${accentColor}
- What they need: ${description}
- Their customers: ${customers}
- Their services/offerings: ${services}${logoUrl ? '\n- Logo URL: ' + logoUrl : ''}${mood ? '\n- Desired Mood/Vibe: ' + mood : ''}${inspirationUrl ? '\n- Inspiration Website: ' + inspirationUrl : ''}

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
  "estimatedRange": "$199/yr|$2K-$8K|$5K-$15K|$10K-$30K+|$3K-$12K",
  "recommendation": "2-3 sentences explaining why this project type is the right fit for what they described. Reference their specific business, customers, and needs. Be direct and specific, not generic.",
  "technicalConsiderations": [
    {"title": "Consideration Title", "detail": "A realistic technical detail sentence about how this would be implemented for their specific use case", "questions": ["A specific discovery question we would ask the client about this topic", "A second question drilling into their current setup or requirements"]}
  ],
  "ctaText": "A compelling call-to-action button text (3-5 words)",
  "secondaryCta": "A secondary action text (e.g. 'View Our Menu', 'See Our Work', 'Learn More')",
  "layoutStyle": "bold|elegant|clean|warm|magazine|startup|artisan",
  "heroStyle": "gradient|split|centered|fullwidth|editorial|asymmetric|video-style",
  "navStyle": "transparent|solid|minimal",
  "testimonial": {"quote": "A realistic-sounding customer testimonial for this type of business", "author": "A realistic first name and last initial", "role": "Customer title like 'Regular Customer' or 'Client since 2023'"},
  "stats": [
    {"value": "A realistic metric", "label": "Short label"}
  ],
  "featureHighlight": "One standout feature or differentiator for the hero area (e.g. 'Free Delivery on Orders Over $30', 'No Contracts Ever', 'Licensed & Insured')",
  "headingFont": "A specific Google Font name for headings (e.g. 'Playfair Display', 'Space Grotesk', 'Sora', 'Fraunces')",
  "bodyFont": "A specific Google Font name for body text (e.g. 'Inter', 'Source Sans 3', 'Nunito', 'Karla')",
  "logoUrl": "${logoUrl || ''}",
  "unsplashKeywords": ["keyword1", "keyword2", "keyword3"],
  "heroImageQuery": "A specific Unsplash search query for the hero background image (e.g. 'modern coffee shop interior warm lighting')",
  "sectionImages": [
    {"section": "services", "query": "A specific Unsplash search query relevant to their services"},
    {"section": "about", "query": "A specific Unsplash search query for the about section"}
  ]
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
- DESIGN CREATIVITY IS CRITICAL:
  - Do NOT default to "gradient" as heroStyle — use the full range of hero styles. Match it to the mood/vibe.
  - Choose headingFont and bodyFont as a SPECIFIC pairing from Google Fonts. Do NOT use Outfit or DM Sans. Pick fonts that match the brand personality: serif fonts for premium/editorial brands, geometric sans for tech/modern, rounded sans for friendly/warm, display fonts for bold/energetic.
  - Examples of good pairings: "Playfair Display" + "Source Sans 3", "Space Grotesk" + "Inter", "Fraunces" + "Nunito", "Sora" + "Karla", "Libre Baskerville" + "Raleway", "Josefin Sans" + "Lato"
  - unsplashKeywords should be 3 specific, descriptive keywords that would find great stock photos for this business (not generic words like "business" or "office")
  - heroImageQuery should be a descriptive 4-6 word Unsplash search query that would return a compelling hero photo specific to this business
  - sectionImages should have 2-3 entries with specific queries for services and about sections
${mood ? '  - The client specified a "' + mood + '" vibe — let this strongly influence your font choices, layout style, hero style, and overall design direction' : ''}
${inspirationUrl ? '  - The client admires ' + inspirationUrl + ' — try to match its general aesthetic and layout approach' : ''}
- layoutStyle choices:
  - "bold" for fitness/sports/energy brands — strong contrast, heavy type
  - "elegant" for professional services/luxury — refined spacing, thin borders
  - "clean" for tech/saas/modern — lots of whitespace, minimal borders
  - "warm" for food/family/community — rounded corners, soft shadows
  - "magazine" for editorial/media/content-heavy — grid layouts, mixed type sizes, editorial feel
  - "startup" for SaaS/startup/innovation — generous whitespace, centered layouts, big headlines
  - "artisan" for handcrafted/local/boutique — textured feel, organic shapes, earthy tones
- heroStyle choices:
  - "gradient" uses brand color gradient background
  - "split" puts text left and a colored block right
  - "centered" is minimal centered text on white
  - "fullwidth" is big bold text edge to edge
  - "editorial" is large serif headline over muted background with understated elegance
  - "asymmetric" is off-center layout with overlapping elements and dynamic composition
  - "video-style" is dark overlay with centered text as if layered over video/photography
- navStyle: "transparent" overlays on hero, "solid" is white with shadow, "minimal" is just logo and hamburger
- stats should have exactly 3-4 items with realistic numbers for this specific industry (e.g. restaurant: "500+ Orders/Week", gym: "200+ Members")
- The testimonial should sound authentic for this industry, not generic
- If the client provided a logoUrl, include it in the response as-is`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
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
    '/solutions/white-glove', '/solutions/franchise', '/solutions/websites', '/solutions/data-extraction',
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

// ── Static page SEO overrides ───────────────────────────────────────────────
const PAGE_SEO = {
  '/solutions/websites': {
    title: '$199 Custom Website — Designed, Built & Hosted in One Week | doITbetter labs',
    description: 'Get a custom-designed, mobile-responsive, SEO-optimized website for $199/year. No templates, no page builders, no hidden fees. Built by real developers in one week.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "$199 Custom Website Package",
      "description": "A custom-designed, mobile-responsive, SEO-optimized website built in one week and hosted for a full year.",
      "brand": { "@type": "Organization", "name": "doITbetter labs" },
      "offers": {
        "@type": "Offer",
        "price": "199",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "url": SITE_URL + "/solutions/websites",
      }
    }
  },
  '/solutions/case-management': {
    title: 'Custom Process & Case Management Software | doITbetter labs',
    description: 'Your process doesn\'t fit their process. We build custom workflow and case management software that handles branching processes, vendor integration, and multi-stakeholder handoffs.',
  },
  '/solutions/small-business': {
    title: 'Small Business Software Solutions | doITbetter labs',
    description: 'Custom software for small businesses — web apps, automation, integrations. From idea to production in as little as 2 weeks.',
  },
  '/solutions/franchise': {
    title: 'Franchise Software Solutions | doITbetter labs',
    description: 'Custom software for franchise operations — multi-location dashboards, reporting, compliance tools. Built to scale.',
  },
  '/solutions/white-glove': {
    title: 'White-Glove Software Development | doITbetter labs',
    description: 'Premium custom software development with dedicated project management, priority support, and hands-on collaboration.',
  },
  '/solutions/data-extraction': {
    title: 'Automated Invoice & Document Data Extraction | doITbetter labs',
    description: 'Eliminate manual data entry from invoices, purchase orders, and vendor documents. AI-powered extraction with reusable templates. Built for fleet management, logistics, and any business drowning in paper.',
  },
  '/build': {
    title: 'Preview Your Project — Free AI-Powered Site Preview | doITbetter labs',
    description: 'Describe your business and see a live preview of your custom website or app in seconds. Free, powered by AI.',
  },
  '/blog': {
    title: 'Blog — AI, Software Development & Business Strategy | doITbetter labs',
    description: 'Practical insights on AI, custom software, and digital strategy for small and mid-size businesses. No fluff.',
  },
  '/privacy': {
    title: 'Privacy Policy | doITbetter labs',
    description: 'How doITbetter labs collects, uses, and protects your data. Our privacy policy covers analytics, visitor tracking, and third-party services.',
  },
}

// ── SPA fallback with SEO injection ─────────────────────────────────────────
app.get('*', async (req, res) => {
  const html = htmlTemplate || readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8')

  // Static page SEO overrides
  const pageSeo = PAGE_SEO[req.path] || PAGE_SEO[req.path.replace(/\/$/, '')]
  if (pageSeo) {
    return res.send(injectSEO(html, {
      title: pageSeo.title,
      description: pageSeo.description,
      url: `${SITE_URL}${req.path}`,
      structuredData: pageSeo.structuredData,
    }))
  }

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

// ── Scheduled post publisher (checks every 60s) ────────────────────────────
async function publishScheduledPosts() {
  if (!supabase) return
  try {
    const now = new Date().toISOString()
    const { data: due } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
    if (!due || due.length === 0) return
    for (const post of due) {
      await supabase.from('blog_posts').update({
        status: 'published',
        published_at: now,
        updated_at: now,
      }).eq('id', post.id)
      console.log(`[scheduler] Published: ${post.title}`)
    }
  } catch (err) {
    console.error('[scheduler]', err.message)
  }
}
setInterval(publishScheduledPosts, 60 * 1000)

app.listen(PORT, () => {
  console.log(`doITbetter labs running on port ${PORT}`)
  console.log(`Visitor tracking: ${supabase ? 'ENABLED' : 'DISABLED (missing SUPABASE_URL or SUPABASE_SERVICE_KEY)'}`)
  console.log(`IP enrichment: ${process.env.IPINFO_TOKEN ? 'ENABLED' : 'DISABLED (missing IPINFO_TOKEN)'}`)
  console.log(`Slack alerts: ${SLACK_WEBHOOK_URL ? 'ENABLED' : 'DISABLED (missing SLACK_WEBHOOK_URL)'}`)
})
