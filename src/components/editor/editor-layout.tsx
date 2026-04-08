'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InputForm } from './input-form'
import { SectionList } from './section-list'
import { SectionEditor } from './section-editor'
import { ThemePicker } from './theme-picker'
import { VoiceControls } from './voice-controls'
import { useEditorStore } from '@/stores/editor-store'
import type { Presentation, Section } from '@/types/database'

interface EditorLayoutProps {
  initialPresentation: Presentation
  initialSections: Section[]
}

export function EditorLayout({ initialPresentation, initialSections }: EditorLayoutProps) {
  const {
    presentation,
    sections,
    activeSection,
    isGenerating,
    isGeneratingVoice,
    setPresentation,
    setSections,
    setGenerating,
    setGeneratingVoice,
  } = useEditorStore()

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(initialPresentation.title)

  // Hydrate store on mount
  useEffect(() => {
    setPresentation(initialPresentation)
    setSections(initialSections)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentPresentation = presentation ?? initialPresentation
  const currentSections = sections.length > 0 ? sections : initialSections
  const activeS = currentSections.find((s) => s.id === activeSection)

  const handleTitleSave = async () => {
    setEditingTitle(false)
    if (titleDraft === currentPresentation.title) return
    setPresentation({ ...currentPresentation, title: titleDraft })
    try {
      await fetch(`/api/presentations/${currentPresentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleDraft }),
      })
    } catch {
      // revert on error
      setTitleDraft(currentPresentation.title)
    }
  }

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/presentations/${currentPresentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      if (res.ok) {
        setPresentation({ ...currentPresentation, status: 'published' })
      }
    } catch {
      // TODO: toast error
    }
  }

  const handleGenerateAll = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/presentations/${currentPresentation.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: currentPresentation.company_name,
          company_description: currentPresentation.company_description,
          target_audience: currentPresentation.target_audience,
          selling_points: currentPresentation.selling_points,
          pricing_info: currentPresentation.pricing_info,
          additional_context: currentPresentation.additional_context,
          language: currentPresentation.language,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.presentation) setPresentation(data.presentation)
        if (data.sections) setSections(data.sections)
      }
    } catch {
      // TODO: toast
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateVoice = async () => {
    setGeneratingVoice(true)
    try {
      const res = await fetch(`/api/presentations/${currentPresentation.id}/voice`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setPresentation({
          ...currentPresentation,
          audio_url: data.audio_url ?? currentPresentation.audio_url,
          audio_duration: data.audio_duration ?? currentPresentation.audio_duration,
        })
      }
    } catch {
      // TODO: toast
    } finally {
      setGeneratingVoice(false)
    }
  }

  const handleThemeSelect = async (theme: { name: string; primary: string; accent: string; bg: string }) => {
    const updated = {
      ...currentPresentation,
      theme_preset: theme.name,
      theme_primary: theme.primary,
      theme_accent: theme.accent,
      theme_bg: theme.bg,
    }
    setPresentation(updated)
    try {
      await fetch(`/api/presentations/${currentPresentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_preset: theme.name,
          theme_primary: theme.primary,
          theme_accent: theme.accent,
          theme_bg: theme.bg,
        }),
      })
    } catch {
      // TODO: toast
    }
  }

  const statusVariant = (
    { draft: 'secondary', generating: 'default', ready: 'success', published: 'success' } as const
  )[currentPresentation.status] ?? 'secondary'

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 shrink-0">
        {/* Title */}
        {editingTitle ? (
          <input
            className="text-lg font-semibold bg-transparent border-b border-primary text-foreground focus:outline-none px-1"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave()
              if (e.key === 'Escape') {
                setTitleDraft(currentPresentation.title)
                setEditingTitle(false)
              }
            }}
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
            onClick={() => setEditingTitle(true)}
          >
            {currentPresentation.title}
          </button>
        )}

        <Badge variant={statusVariant}>{currentPresentation.status}</Badge>

        <div className="flex-1" />

        {/* Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateAll}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Generando...
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Generar IA
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateVoice}
          disabled={isGeneratingVoice || currentSections.length === 0}
        >
          {isGeneratingVoice ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Generando voz...
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
              </svg>
              Generar voz
            </>
          )}
        </Button>

        <Button
          size="sm"
          onClick={handlePublish}
          disabled={currentPresentation.status === 'published' || currentSections.length === 0}
        >
          Publicar
        </Button>
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT panel */}
        <div className="w-[350px] shrink-0 border-r border-border overflow-y-auto p-4 flex flex-col gap-6">
          <InputForm />
          <hr className="border-border" />
          <ThemePicker
            selectedPreset={currentPresentation.theme_preset}
            onSelect={handleThemeSelect}
          />
          <hr className="border-border" />
          <SectionList />
        </div>

        {/* CENTER panel — live preview */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="flex flex-col items-center justify-center h-full p-8">
            {activeS ? (
              <div
                className="w-full max-w-3xl rounded-2xl border border-border overflow-hidden shadow-lg"
                style={{ backgroundColor: currentPresentation.theme_bg }}
              >
                {/* Preview header */}
                <div className="p-6 border-b border-white/10">
                  {activeS.label && (
                    <span
                      className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: currentPresentation.theme_accent }}
                    >
                      {activeS.label}
                    </span>
                  )}
                  {activeS.title && (
                    <h2 className="text-2xl font-bold text-white mb-1">{activeS.title}</h2>
                  )}
                  {activeS.subtitle && (
                    <p className="text-sm text-white/60">{activeS.subtitle}</p>
                  )}
                </div>

                {/* Preview body */}
                <div className="p-6">
                  <Badge variant="outline" className="mb-3 text-white/60 border-white/20">
                    {activeS.section_type}
                  </Badge>
                  <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
                    {JSON.stringify(activeS.content_json, null, 2)}
                  </pre>
                </div>

                {/* Voice script preview */}
                {activeS.voice_script && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Guion de voz</p>
                    <p className="text-sm text-white/60 italic leading-relaxed">
                      {activeS.voice_script}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p className="text-muted-foreground">
                  Vista previa de la presentacion
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Genera contenido para ver la previsualizacion aqui
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT panel */}
        <div className="w-[300px] shrink-0 border-l border-border overflow-y-auto p-4 flex flex-col gap-6">
          <SectionEditor />
          <hr className="border-border" />
          <VoiceControls />
        </div>
      </div>
    </div>
  )
}
