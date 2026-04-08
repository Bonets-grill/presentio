'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEditorStore } from '@/stores/editor-store'

const typeLabels: Record<string, string> = {
  hero: 'Hero',
  kpi_grid: 'KPIs',
  data_table: 'Tabla',
  step_flow: 'Pasos',
  chat_simulation: 'Chat',
  email_preview: 'Email',
  progress_bars: 'Barras',
  card_grid: 'Cards',
  big_impact: 'Impacto',
  custom: 'Custom',
  footer: 'Footer',
}

export function SectionList() {
  const { sections, activeSection, setActiveSection, reorderSections } = useEditorStore()

  const moveUp = (index: number) => {
    if (index === 0) return
    const ids = sections.map((s) => s.id)
    ;[ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]
    reorderSections(ids)
  }

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return
    const ids = sections.map((s) => s.id)
    ;[ids[index], ids[index + 1]] = [ids[index + 1], ids[index]]
    reorderSections(ids)
  }

  const handleDelete = async (sectionId: string) => {
    // TODO: call API to delete, then remove from store
    const { presentation, setSections } = useEditorStore.getState()
    if (!presentation) return
    try {
      await fetch(`/api/presentations/${presentation.id}/sections/${sectionId}`, {
        method: 'DELETE',
      })
      setSections(sections.filter((s) => s.id !== sectionId))
    } catch {
      // TODO: toast error
    }
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <svg className="h-10 w-10 text-muted-foreground/40 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
        <p className="text-sm text-muted-foreground">
          Sin secciones. Completa el formulario y genera con IA.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground mb-1">Secciones</label>
      {sections.map((section, index) => (
        <div
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors cursor-pointer ${
            activeSection === section.id
              ? 'border-primary bg-primary/5'
              : 'border-transparent hover:border-border hover:bg-muted/50'
          }`}
        >
          {/* Reorder arrows */}
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                moveUp(index)
              }}
              disabled={index === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                moveDown(index)
              }}
              disabled={index === sections.length - 1}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Type badge */}
          <Badge variant="outline" className="text-[10px] shrink-0">
            {typeLabels[section.section_type] ?? section.section_type}
          </Badge>

          {/* Label */}
          <span className="text-sm text-foreground truncate flex-1">
            {section.nav_label}
          </span>

          {/* Voice status */}
          <span title={section.audio_url ? 'Audio generado' : 'Sin audio'}>
            {section.audio_url ? (
              <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </span>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(section.id)
            }}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
