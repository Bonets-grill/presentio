export interface HeroContent {
  badge?: string
  companyName: string
  headline: string
  subheadline: string
  ctaText: string
  stats: { value: string; label: string }[]
}

export interface KPIGridContent {
  items: { label: string; value: string; prefix?: string; suffix?: string; change?: string; changeColor?: 'success' | 'warning' | 'danger' }[]
}

export interface DataTableContent {
  title?: string
  headers: string[]
  rows: Record<string, string>[]
}

export interface StepFlowContent {
  title?: string
  steps: { title: string; description: string; detail?: string }[]
  color?: string
  animated?: boolean
}

export interface ChatSimulationContent {
  botName: string
  botAvatar: string
  messages: { type: 'customer' | 'bot' | 'typing'; text?: string; delay?: number; hasDetail?: boolean; detailHtml?: string }[]
}

export interface EmailPreviewContent {
  emails: { label: string; badge: string; badgeColor: string; description: string; from: string; to: string; subject: string; bodyHtml: string }[]
}

export interface ProgressBarsContent {
  bars: { label: string; value: number; maxValue: number; color?: string; displayValue: string }[]
}

export interface CardGridContent {
  cards: { icon?: string; title: string; description: string; badge?: string; badgeColor?: string }[]
}

export interface BigImpactContent {
  headline: string
  value: string
  subtitle: string
  breakdownItems: { label: string; value: string }[]
}

export interface FooterContent {
  companyName: string
  tagline?: string
  date?: string
  validUntil?: string
}
