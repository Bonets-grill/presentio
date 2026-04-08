'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/stores/editor-store'

export function SectionEditor() {
  const { sections, activeSection, updateSection, presentation } = useEditorStore()
  const section = sections.find((s) => s.id === activeSection)

  const [navLabel, setNavLabel] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [label, setLabel] = useState('')
  const [voiceScript, setVoiceScript] = useState('')
  const [contentJson, setContentJson] = useState('')
  const [jsonError, setJsonError] = useState('')

  // Sync local state when active section changes
  useEffect(() => {
    if (section) {
      setNavLabel(section.nav_label)
      setTitle(section.title ?? '')
      setSubtitle(section.subtitle ?? '')
      setLabel(section.label ?? '')
      setVoiceScript(section.voice_script ?? '')
      setContentJson(JSON.stringify(section.content_json, null, 2))
      setJsonError('')
    }
  }, [section?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <svg className="h-8 w-8 text-muted-foreground/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p className="text-sm text-muted-foreground">
          Selecciona una seccion para editar
        </p>
      </div>
    )
  }

  const saveField = async (field: string, value: unknown) => {
    if (!presentation) return
    updateSection(section.id, { [field]: value } as never)
    try {
      await fetch(`/api/presentations/${presentation.id}/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
    } catch {
      // TODO: toast error
    }
  }

  const handleContentJsonBlur = () => {
    try {
      const parsed = JSON.parse(contentJson)
      setJsonError('')
      saveField('content_json', parsed)
    } catch {
      setJsonError('JSON invalido')
    }
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Editar seccion</h3>
        <Badge variant="outline">{section.section_type}</Badge>
      </div>

      <Input
        label="Etiqueta de navegacion"
        value={navLabel}
        onChange={(e) => setNavLabel(e.target.value)}
        onBlur={() => saveField('nav_label', navLabel)}
      />

      <Input
        label="Titulo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => saveField('title', title || null)}
      />

      <Input
        label="Subtitulo"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        onBlur={() => saveField('subtitle', subtitle || null)}
      />

      <Input
        label="Label"
        placeholder="Ej: Modulo 1"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => saveField('label', label || null)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Guion de voz</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[120px] resize-y"
          placeholder="Texto que se narrara en esta seccion..."
          value={voiceScript}
          onChange={(e) => setVoiceScript(e.target.value)}
          onBlur={() => saveField('voice_script', voiceScript || null)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Contenido (JSON)</label>
        <textarea
          className={`w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[200px] resize-y ${
            jsonError ? 'border-destructive' : 'border-input'
          }`}
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          onBlur={handleContentJsonBlur}
        />
        {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          try {
            const formatted = JSON.stringify(JSON.parse(contentJson), null, 2)
            setContentJson(formatted)
            setJsonError('')
          } catch {
            setJsonError('JSON invalido')
          }
        }}
      >
        Formatear JSON
      </Button>
    </div>
  )
}
