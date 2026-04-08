import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { buildTimestampMap } from '@/lib/voice/timestamp-builder'
import { ViewerShell } from '@/components/viewer/viewer-shell'
import type { Presentation, Section } from '@/types/database'

/**
 * Service-role Supabase client for public read access.
 * No cookies/auth needed — viewers are anonymous.
 */
function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = getServiceSupabase()

  const { data: presentation } = await supabase
    .from('presentations')
    .select('title, company_name, target_audience')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!presentation) {
    return { title: 'Presentation Not Found' }
  }

  const title = presentation.company_name
    ? `${presentation.title} — ${presentation.company_name}`
    : presentation.title

  const description = presentation.target_audience
    ? `Interactive presentation for ${presentation.target_audience}`
    : 'Interactive AI-powered presentation with voice narration'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function PresentationViewerPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = getServiceSupabase()

  // Fetch presentation
  const { data: presentation, error: presError } = await supabase
    .from('presentations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (presError || !presentation) {
    notFound()
  }

  // Fetch sections ordered
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('presentation_id', presentation.id)
    .order('order', { ascending: true })

  const typedPresentation = presentation as Presentation
  const typedSections = (sections ?? []) as Section[]

  // Build timestamp cues from section audio data
  const cues = buildTimestampMap(
    typedSections.map(s => ({
      id: s.id,
      navLabel: s.nav_label,
      audioDuration: s.audio_duration,
      audioStartTime: s.audio_start_time,
    }))
  )

  // Increment view count (fire-and-forget)
  supabase
    .from('presentations')
    .update({ view_count: typedPresentation.view_count + 1 })
    .eq('id', typedPresentation.id)
    .then(() => {})

  // Build CSS variables from presentation theme
  const themeVars = {
    '--pres-primary': typedPresentation.theme_primary || '#1a5c38',
    '--pres-primary-light': lightenColor(typedPresentation.theme_primary || '#1a5c38'),
    '--pres-accent': typedPresentation.theme_accent || '#d4a843',
    '--pres-bg': typedPresentation.theme_bg || '#0a0f0d',
    '--pres-bg-card': adjustAlpha(typedPresentation.theme_bg || '#0a0f0d', 0.4),
    '--pres-text': '#e8ede9',
    '--pres-text-muted': '#8a9b8f',
    '--pres-border': '#1e2e24',
  } as React.CSSProperties

  return (
    <div style={themeVars}>
      <ViewerShell
        presentation={typedPresentation}
        sections={typedSections}
        cues={cues}
      />
    </div>
  )
}

/** Simple color lightening — add ~30% to each channel */
function lightenColor(hex: string): string {
  const clean = hex.replace('#', '')
  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + 40)
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + 40)
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + 40)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Adjust background for card variant */
function adjustAlpha(hex: string, _factor: number): string {
  const clean = hex.replace('#', '')
  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + 10)
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + 16)
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + 12)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
