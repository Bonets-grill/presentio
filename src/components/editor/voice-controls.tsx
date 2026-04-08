'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEditorStore } from '@/stores/editor-store'

const voices = [
  { id: 'alloy', name: 'Alloy', lang: 'Multi' },
  { id: 'echo', name: 'Echo', lang: 'Multi' },
  { id: 'fable', name: 'Fable', lang: 'Multi' },
  { id: 'onyx', name: 'Onyx', lang: 'Multi' },
  { id: 'nova', name: 'Nova', lang: 'Multi' },
  { id: 'shimmer', name: 'Shimmer', lang: 'Multi' },
]

export function VoiceControls() {
  const { presentation, isGeneratingVoice, setGeneratingVoice, setPresentation } = useEditorStore()
  const [showVoices, setShowVoices] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (!presentation) return null

  const currentVoice = voices.find((v) => v.id === presentation.voice_id) || voices[0]

  const handleGenerateVoice = async () => {
    setGeneratingVoice(true)
    try {
      const res = await fetch(`/api/presentations/${presentation.id}/voice`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setPresentation({
          ...presentation,
          audio_url: data.audio_url ?? presentation.audio_url,
          audio_duration: data.audio_duration ?? presentation.audio_duration,
        })
      }
    } catch {
      // TODO: toast error
    } finally {
      setGeneratingVoice(false)
    }
  }

  const handleChangeVoice = async (voiceId: string) => {
    setShowVoices(false)
    try {
      await fetch(`/api/presentations/${presentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice_id: voiceId }),
      })
      setPresentation({ ...presentation, voice_id: voiceId })
    } catch {
      // TODO: toast error
    }
  }

  const togglePlayback = () => {
    if (!presentation.audio_url) return
    if (!audioRef.current) {
      audioRef.current = new Audio(presentation.audio_url)
      audioRef.current.onended = () => setIsPlaying(false)
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground">Voz</label>

      {/* Current voice */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{currentVoice.name}</Badge>
          <span className="text-xs text-muted-foreground">{currentVoice.lang}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowVoices(!showVoices)}>
          Cambiar
        </Button>
      </div>

      {/* Voice selector dropdown */}
      {showVoices && (
        <div className="rounded-lg border border-border bg-card p-2 flex flex-col gap-1">
          {voices.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleChangeVoice(v.id)}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
                v.id === presentation.voice_id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <span>{v.name}</span>
              <span className="text-xs text-muted-foreground">{v.lang}</span>
            </button>
          ))}
        </div>
      )}

      {/* Generate button */}
      <Button
        onClick={handleGenerateVoice}
        disabled={isGeneratingVoice}
        variant="outline"
        size="sm"
      >
        {isGeneratingVoice ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            Generando voz...
          </>
        ) : (
          'Generar voz'
        )}
      </Button>

      {/* Duration + playback */}
      {presentation.audio_url && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={togglePlayback}>
            {isPlaying ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </Button>
          {presentation.audio_duration != null && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(presentation.audio_duration)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
