'use client'

import { useState, useCallback, type ReactNode } from 'react'
import type { Section } from '@/types/database'

interface PresentationShellProps {
  sections: Section[]
  theme: { primary: string; accent: string; bg: string }
  children?: ReactNode
  renderSection: (section: Section, isActive: boolean) => ReactNode
}

export function PresentationShell({
  sections,
  theme,
  renderSection,
}: PresentationShellProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sections[0]?.id ?? ''
  )

  const showSection = useCallback((id: string) => {
    setActiveSectionId(id)
  }, [])

  // Derive CSS variables from theme + defaults
  const themeVars: Record<string, string> = {
    '--primary': theme.primary || '#1a5c38',
    '--primary-light': lighten(theme.primary || '#1a5c38'),
    '--accent': theme.accent || '#d4a843',
    '--bg': theme.bg || '#0a0f0d',
    '--bg-card': shiftColor(theme.bg || '#0a0f0d', 8),
    '--text': '#e8ede9',
    '--text-muted': '#8a9b8f',
    '--border': '#1e2e24',
    '--success': '#22c55e',
    '--warning': '#f59e0b',
    '--danger': '#ef4444',
    '--info': '#3b82f6',
  }

  return (
    <div
      className="presentation-theme min-h-screen font-[Inter,sans-serif]"
      style={{
        ...themeVars,
        background: 'var(--bg)',
        color: 'var(--text)',
        overflowX: 'hidden',
      } as React.CSSProperties}
    >
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 h-14 border-b border-[var(--border)] backdrop-blur-[12px] bg-[rgba(10,15,13,0.92)]">
        <div className="font-extrabold text-base text-[var(--accent)] tracking-[1px]">
          {sections[0]?.nav_label ?? 'Presentio'}
        </div>
        <div className="hidden md:flex gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => showSection(section.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 border-none bg-transparent ${
                activeSectionId === section.id
                  ? 'bg-[rgba(26,92,56,0.2)] text-[var(--primary-light)]'
                  : 'text-[var(--text-muted)] hover:bg-[rgba(26,92,56,0.2)] hover:text-[var(--primary-light)]'
              }`}
            >
              {section.nav_label}
            </button>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <div className="pt-14">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId
          return (
            <div
              key={section.id}
              className={`min-h-screen px-8 pb-8 pt-5 max-w-[1300px] mx-auto ${
                isActive
                  ? 'block animate-[fadeIn_0.4s_ease]'
                  : 'hidden'
              }`}
            >
              {renderSection(section, isActive)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Simple color utility: lighten a hex color */
function lighten(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lr = Math.min(255, r + 40)
    const lg = Math.min(255, g + 50)
    const lb = Math.min(255, b + 30)
    return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`
  } catch {
    return '#2d8a56'
  }
}

/** Shift a hex color brightness */
function shiftColor(hex: string, amount: number): string {
  try {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount)
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount + 2)
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch {
    return '#111a15'
  }
}
