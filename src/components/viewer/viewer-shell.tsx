'use client'

import { useState, useCallback } from 'react'
import { VoiceOnboarding, type AudioSegment } from './voice-onboarding'
import type { Section, Presentation } from '@/types/database'
import type { TimestampCue } from '@/lib/voice/timestamp-builder'
import { SectionHeader } from '@/components/presentation/section-header'
import { HeroSection } from '@/components/presentation/hero-section'
import type { HeroContent } from '@/types/presentation'

interface ViewerShellProps {
  presentation: Presentation
  sections: Section[]
  cues: TimestampCue[]
}

export function ViewerShell({ presentation, sections, cues }: ViewerShellProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '')
  const [voiceActive, setVoiceActive] = useState(false)
  const [viewStarted] = useState(() => Date.now())

  // Build audio segments for voice onboarding
  const audioSegments: AudioSegment[] = sections
    .filter(s => s.audio_url && s.audio_duration)
    .map(s => ({
      sectionId: s.id,
      url: s.audio_url!,
      duration: s.audio_duration!,
      startTime: s.audio_start_time ?? 0,
    }))

  const hasVoice = audioSegments.length > 0

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId)
    // Track section view
    trackEvent('section_view', { sectionId })
  }, [])

  const handleNavClick = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId)
    window.scrollTo(0, 0)
  }, [])

  const handleVoiceStart = useCallback(() => {
    setVoiceActive(true)
    trackEvent('voice_start', {})
  }, [])

  const handleVoiceStop = useCallback(() => {
    setVoiceActive(false)
    trackEvent('voice_stop', {
      durationSeconds: Math.round((Date.now() - viewStarted) / 1000),
    })
  }, [viewStarted])

  // Find active section
  const activeSection = sections.find(s => s.id === activeSectionId) ?? sections[0]
  const heroSection = sections.find(s => s.section_type === 'hero')

  return (
    <div className="presentation-theme min-h-screen" style={{ background: 'var(--pres-bg, #0a0f0d)' }}>
      {/* Navigation bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[200] h-14 flex items-center gap-1 px-4 overflow-x-auto"
        style={{
          background: 'rgba(10,15,13,0.95)',
          borderBottom: '1px solid var(--pres-border, #1e2e24)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span
          className="text-sm font-bold mr-4 shrink-0"
          style={{ color: 'var(--pres-accent, #d4a843)' }}
        >
          {presentation.company_name ?? presentation.title}
        </span>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => handleNavClick(s.id)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border-none"
            style={{
              background: s.id === activeSectionId ? 'rgba(45,138,86,0.2)' : 'transparent',
              color: s.id === activeSectionId
                ? 'var(--pres-primary-light, #2d8a56)'
                : 'var(--pres-text-muted, #8a9b8f)',
            }}
          >
            {s.nav_label}
          </button>
        ))}
      </nav>

      {/* Main content area */}
      <main className="pt-14">
        {/* Show active section */}
        {activeSection?.section_type === 'hero' && heroSection ? (
          <div className="relative">
            <HeroSection content={heroSection.content_json as unknown as HeroContent} />
            {/* Action buttons overlay in hero */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 z-10">
              <button
                onClick={() => handleNavClick(sections[1]?.id ?? sections[0]?.id)}
                className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(17,26,21,0.9)',
                  border: '1px solid var(--pres-border, #1e2e24)',
                  color: 'var(--pres-text, #e8ede9)',
                }}
              >
                Explorar Manualmente
              </button>
              {hasVoice && (
                <button
                  onClick={handleVoiceStart}
                  className="px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--pres-accent, #d4a843), #b8912e)',
                    color: 'var(--pres-bg, #0a0f0d)',
                    boxShadow: '0 4px 20px rgba(212,168,67,0.3)',
                    border: 'none',
                  }}
                >
                  Presentacion Guiada con Voz
                </button>
              )}
            </div>
          </div>
        ) : activeSection ? (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <SectionHeader
              label={activeSection.label ?? undefined}
              title={activeSection.title ?? activeSection.nav_label}
              subtitle={activeSection.subtitle ?? undefined}
            />
            {/* Section content rendered based on type — uses content_json */}
            <div className="mt-8">
              <SectionContent section={activeSection} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Voice onboarding overlay */}
      {voiceActive && (
        <VoiceOnboarding
          audioUrls={audioSegments}
          cues={cues}
          onSectionChange={handleSectionChange}
          onStop={handleVoiceStop}
        />
      )}
    </div>
  )
}

/** Generic section content renderer */
function SectionContent({ section }: { section: Section }) {
  const data = section.content_json

  switch (section.section_type) {
    case 'kpi_grid': {
      const items = (data as { items?: { label: string; value: string; change?: string; changeColor?: string }[] }).items ?? []
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{
                background: 'var(--pres-bg-card, #111a15)',
                border: '1px solid var(--pres-border, #1e2e24)',
              }}
            >
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
                {item.label}
              </div>
              <div className="text-2xl font-extrabold" style={{ color: 'var(--pres-accent, #d4a843)' }}>
                {item.value}
              </div>
              {item.change && (
                <div className="text-xs mt-1" style={{ color: item.changeColor === 'danger' ? '#ef4444' : '#22c55e' }}>
                  {item.change}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    case 'card_grid': {
      const cards = (data as { cards?: { title: string; description: string; icon?: string; badge?: string }[] }).cards ?? []
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{
                background: 'var(--pres-bg-card, #111a15)',
                border: '1px solid var(--pres-border, #1e2e24)',
              }}
            >
              {card.icon && <div className="text-2xl mb-3">{card.icon}</div>}
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--pres-text, #e8ede9)' }}>
                {card.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      )
    }

    case 'big_impact': {
      const content = data as { headline?: string; value?: string; subtitle?: string; breakdownItems?: { label: string; value: string }[] }
      return (
        <div className="text-center py-12">
          <div className="text-lg mb-4" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
            {content.headline}
          </div>
          <div
            className="text-[clamp(3rem,8vw,6rem)] font-black"
            style={{ color: 'var(--pres-accent, #d4a843)' }}
          >
            {content.value}
          </div>
          <div className="text-base mt-2" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
            {content.subtitle}
          </div>
          {content.breakdownItems && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {content.breakdownItems.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--pres-text, #e8ede9)' }}>
                    {item.value}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    case 'step_flow': {
      const steps = (data as { steps?: { title: string; description: string; detail?: string }[] }).steps ?? []
      return (
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl"
              style={{
                background: 'var(--pres-bg-card, #111a15)',
                border: '1px solid var(--pres-border, #1e2e24)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{
                  background: 'rgba(45,138,86,0.2)',
                  color: 'var(--pres-primary-light, #2d8a56)',
                }}
              >
                {i + 1}
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--pres-text, #e8ede9)' }}>
                  {step.title}
                </h4>
                <p className="text-sm" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'progress_bars': {
      const bars = (data as { bars?: { label: string; value: number; maxValue: number; displayValue: string; color?: string }[] }).bars ?? []
      return (
        <div className="space-y-4">
          {bars.map((bar, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--pres-text, #e8ede9)' }}>{bar.label}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--pres-accent, #d4a843)' }}>{bar.displayValue}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'var(--pres-border, #1e2e24)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(bar.value / bar.maxValue) * 100}%`,
                    background: bar.color ?? 'var(--pres-primary-light, #2d8a56)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'data_table': {
      const table = data as { headers?: string[]; rows?: Record<string, string>[] }
      const headers = table.headers ?? []
      const rows = table.rows ?? []
      return (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--pres-border, #1e2e24)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--pres-bg-card, #111a15)' }}>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-3 font-semibold"
                    style={{ color: 'var(--pres-text-muted, #8a9b8f)', borderBottom: '1px solid var(--pres-border, #1e2e24)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid var(--pres-border, #1e2e24)' }}>
                  {headers.map((h, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: 'var(--pres-text, #e8ede9)' }}>
                      {row[h] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'footer': {
      const footer = data as { companyName?: string; tagline?: string; date?: string; validUntil?: string }
      return (
        <div className="text-center py-16">
          <div className="text-2xl font-bold mb-2" style={{ color: 'var(--pres-accent, #d4a843)' }}>
            {footer.companyName}
          </div>
          {footer.tagline && (
            <p className="text-sm" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
              {footer.tagline}
            </p>
          )}
          {footer.date && (
            <p className="text-xs mt-4" style={{ color: 'var(--pres-text-muted, #8a9b8f)' }}>
              {footer.date}
            </p>
          )}
        </div>
      )
    }

    default:
      // For chat_simulation, email_preview, custom — render as JSON for now
      return (
        <pre
          className="p-4 rounded-xl text-xs overflow-auto"
          style={{
            background: 'var(--pres-bg-card, #111a15)',
            color: 'var(--pres-text-muted, #8a9b8f)',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )
  }
}

/** Fire-and-forget tracking */
function trackEvent(event: string, data: Record<string, unknown>) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...data }),
    }).catch(() => {})
  } catch {
    // Tracking is best-effort
  }
}
