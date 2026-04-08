import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface GenerateInput {
  companyName: string
  companyDescription: string
  targetAudience: string
  sellingPoints: string[]
  pricingInfo: string
  additionalContext?: string
  language: string // 'es' | 'en' | 'fr' etc.
}

interface GeneratedSection {
  order: number
  section_type: string
  nav_label: string
  title: string
  subtitle: string
  label: string
  content_json: Record<string, unknown>
  voice_script: string
}

interface GeneratedPresentation {
  title: string
  sections: GeneratedSection[]
}

export async function generatePresentation(input: GenerateInput): Promise<GeneratedPresentation> {
  const languageNames: Record<string, string> = {
    es: 'Spanish', en: 'English', fr: 'French', de: 'German', pt: 'Portuguese', it: 'Italian'
  }
  const lang = languageNames[input.language] || 'Spanish'

  const systemPrompt = `You are Presentio AI, an expert at creating interactive sales presentations. You generate complete presentation structures as JSON.

Available section types and their content_json shapes:

1. "hero" — Landing section
   content_json: { badge: string, companyName: string, headline: string, subheadline: string, ctaText: string, stats: [{ value: string, label: string }] }

2. "kpi_grid" — 4 KPI cards in a grid
   content_json: { items: [{ label: string, value: string, prefix?: string, change?: string, changeColor?: "success"|"warning"|"danger" }] }

3. "data_table" — Table with headers and rows
   content_json: { title?: string, headers: [string], rows: [{ col1: string, col2: string, ... }] }

4. "step_flow" — Vertical step-by-step process
   content_json: { title?: string, steps: [{ title: string, description: string, detail?: string }], color?: string, animated?: boolean }

5. "chat_simulation" — WhatsApp-like chat demo
   content_json: { botName: string, botAvatar: string, messages: [{ type: "customer"|"bot"|"typing", text?: string, delay?: number }] }

6. "email_preview" — Email templates preview
   content_json: { emails: [{ label: string, badge: string, badgeColor: string, description: string, from: string, to: string, subject: string, bodyHtml: string }] }

7. "progress_bars" — Horizontal progress bars
   content_json: { bars: [{ label: string, value: number, maxValue: number, color?: string, displayValue: string }] }

8. "card_grid" — Grid of info cards
   content_json: { cards: [{ icon?: string, title: string, description: string, badge?: string, badgeColor?: string }] }

9. "big_impact" — Big result/impact display
   content_json: { headline: string, value: string, subtitle: string, breakdownItems: [{ label: string, value: string }] }

10. "footer" — Footer with company info
    content_json: { companyName: string, tagline?: string, date?: string, validUntil?: string }

Rules:
- Generate 8-12 sections (hero first, big_impact or footer last)
- Vary section types — never two of the same type consecutively
- Write ALL content in ${lang}
- Voice scripts should be conversational, confident, 30-60 words per section
- Use specific numbers, percentages, and data points derived from the user's input — not vague platitudes
- Make it feel like a real, tailored proposal — not a generic template
- The voice script for each section should describe what the viewer is seeing, like a presenter narrating

Return ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "sections": [
    {
      "order": 0,
      "section_type": "hero",
      "nav_label": "string (short, for navigation tab)",
      "title": "string",
      "subtitle": "string",
      "label": "string (e.g. Module 1)",
      "content_json": { ... },
      "voice_script": "string"
    }
  ]
}`

  const userPrompt = `Create a presentation for:

Company: ${input.companyName}
Description: ${input.companyDescription}
Target audience: ${input.targetAudience}
Key selling points:
${input.sellingPoints.map(p => `- ${p}`).join('\n')}
Pricing: ${input.pricingInfo}
${input.additionalContext ? `Additional context: ${input.additionalContext}` : ''}

Language: ${lang}

Generate the complete presentation JSON.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse AI response as JSON')

  return JSON.parse(jsonMatch[0]) as GeneratedPresentation
}
