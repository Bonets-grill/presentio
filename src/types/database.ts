export type Plan = 'free' | 'pro' | 'team'
export type PresentationStatus = 'draft' | 'generating' | 'ready' | 'published'
export type SectionType =
  | 'hero' | 'kpi_grid' | 'data_table' | 'step_flow'
  | 'chat_simulation' | 'email_preview' | 'progress_bars'
  | 'card_grid' | 'big_impact' | 'custom' | 'footer'
export type Language = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  voice_minutes_used: number
  voice_minutes_limit: number
  presentations_count: number
  presentations_limit: number
  locale: Language
  created_at: string
  updated_at: string
}

export interface Presentation {
  id: string
  user_id: string
  title: string
  slug: string | null
  status: PresentationStatus
  company_name: string | null
  company_description: string | null
  target_audience: string | null
  selling_points: string[] | null
  pricing_info: string | null
  additional_context: string | null
  language: Language
  theme_primary: string
  theme_accent: string
  theme_bg: string
  theme_preset: string | null
  audio_url: string | null
  audio_duration: number | null
  voice_id: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  presentation_id: string
  order: number
  section_type: SectionType
  nav_label: string
  title: string | null
  subtitle: string | null
  label: string | null
  content_json: Record<string, unknown>
  voice_script: string | null
  audio_url: string | null
  audio_duration: number | null
  audio_start_time: number | null
  created_at: string
  updated_at: string
}

export interface PresentationView {
  id: string
  presentation_id: string
  viewer_ip: string | null
  user_agent: string | null
  referrer: string | null
  sections_viewed: string[]
  max_section_reached: number
  total_time_seconds: number
  voice_started: boolean
  voice_completed: boolean
  completed: boolean
  created_at: string
  updated_at: string
}
