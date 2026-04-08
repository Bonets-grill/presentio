'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LanguagePicker } from './language-picker'
import { useEditorStore } from '@/stores/editor-store'
import type { Language } from '@/types/database'

export function InputForm() {
  const { presentation, setPresentation, setSections, setGenerating, isGenerating } =
    useEditorStore()

  const [companyName, setCompanyName] = useState(presentation?.company_name ?? '')
  const [companyDesc, setCompanyDesc] = useState(presentation?.company_description ?? '')
  const [targetAudience, setTargetAudience] = useState(presentation?.target_audience ?? '')
  const [sellingPoints, setSellingPoints] = useState(
    presentation?.selling_points?.join('\n') ?? ''
  )
  const [pricingInfo, setPricingInfo] = useState(presentation?.pricing_info ?? '')
  const [additionalContext, setAdditionalContext] = useState(
    presentation?.additional_context ?? ''
  )
  const [language, setLanguage] = useState<Language>(presentation?.language ?? 'es')

  const handleGenerate = async () => {
    if (!presentation) return
    setGenerating(true)

    // Save form data to presentation first
    const body = {
      company_name: companyName,
      company_description: companyDesc,
      target_audience: targetAudience,
      selling_points: sellingPoints
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      pricing_info: pricingInfo,
      additional_context: additionalContext || null,
      language,
    }

    try {
      const res = await fetch(`/api/presentations/${presentation.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.presentation) setPresentation(data.presentation)
        if (data.sections) setSections(data.sections)
      }
    } catch {
      // TODO: toast error
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre de la empresa"
        placeholder="Ej: Acme Corp"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Que hace la empresa?
        </label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[80px] resize-y"
          placeholder="Describe brevemente tu producto o servicio..."
          value={companyDesc}
          onChange={(e) => setCompanyDesc(e.target.value)}
        />
      </div>

      <Input
        label="A quien va dirigida?"
        placeholder="Ej: Restaurantes, startups SaaS..."
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Puntos clave de venta
        </label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[80px] resize-y"
          placeholder="Uno por linea..."
          value={sellingPoints}
          onChange={(e) => setSellingPoints(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Uno por linea</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Informacion de precios
        </label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[60px] resize-y"
          placeholder="Planes, precios, descuentos..."
          value={pricingInfo}
          onChange={(e) => setPricingInfo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Contexto adicional
          <span className="text-muted-foreground font-normal"> (opcional)</span>
        </label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background min-h-[60px] resize-y"
          placeholder="Tono, estilo, datos extra..."
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
        />
      </div>

      <LanguagePicker
        label="Idioma de la presentacion"
        value={language}
        onChange={setLanguage}
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !companyName.trim()}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 mt-2"
        size="lg"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            Generando...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Generar con IA
          </>
        )}
      </Button>
    </div>
  )
}
