import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// ── Claude API endpoint for Build Preview ─────────────────────────────────────
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

// SPA fallback — send index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Lambent Labs running on port ${PORT}`)
})
