'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { ProgressBar } from './progress-bar'
import { SubtitleBar } from './subtitle-bar'
import type { TimestampCue } from '@/lib/voice/timestamp-builder'

export interface AudioSegment {
  sectionId: string
  url: string
  duration: number
  startTime: number
}

interface VoiceOnboardingProps {
  audioUrls: AudioSegment[]
  cues: TimestampCue[]
  onSectionChange: (sectionId: string) => void
  onStop: () => void
}

/**
 * Voice-synced onboarding overlay.
 *
 * Ported from the SIGFREDO_AI_DEMO.html pattern:
 * - 300ms setInterval polling audio.currentTime
 * - obBusy flag prevents overlapping transitions
 * - Sequential advancement only (never skip cues)
 * - Fade to black -> switch section -> fade back in
 *
 * Audio is played per-section sequentially. Cumulative time
 * drives cue matching and the progress bar.
 */
export function VoiceOnboarding({
  audioUrls,
  cues,
  onSectionChange,
  onStop,
}: VoiceOnboardingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const busyRef = useRef(false)
  const runningRef = useRef(true)
  const cueIndexRef = useRef(0)
  const segmentIndexRef = useRef(0)
  const cumulativeOffsetRef = useRef(0)
  const fadeRef = useRef<HTMLDivElement | null>(null)

  const [progress, setProgress] = useState(0)
  const [subtitle, setSubtitle] = useState(cues[0]?.sub ?? '')

  const totalDuration = audioUrls.reduce((sum, a) => sum + a.duration, 0) || 1

  const stopAll = useCallback(() => {
    runningRef.current = false
    busyRef.current = false
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    onStop()
  }, [onStop])

  const playSegment = useCallback((index: number) => {
    if (index >= audioUrls.length) {
      // All segments done
      stopAll()
      return
    }
    segmentIndexRef.current = index

    // Calculate cumulative offset for this segment
    let cumOffset = 0
    for (let i = 0; i < index; i++) {
      cumOffset += audioUrls[i].duration
    }
    cumulativeOffsetRef.current = cumOffset

    const audio = new Audio(audioUrls[index].url)
    audioRef.current = audio

    audio.addEventListener('ended', () => {
      if (!runningRef.current) return
      playSegment(index + 1)
    })

    audio.play().catch(() => {
      // Autoplay blocked — stop gracefully
      stopAll()
    })
  }, [audioUrls, stopAll])

  useEffect(() => {
    // Start first segment
    if (cues.length > 0) {
      setSubtitle(cues[0].sub)
      onSectionChange(cues[0].id)
    }
    cueIndexRef.current = 0
    playSegment(0)

    // 300ms polling interval — matches the original pattern
    timerRef.current = setInterval(() => {
      if (!audioRef.current || !runningRef.current) return

      const currentSegmentTime = audioRef.current.currentTime
      const t = cumulativeOffsetRef.current + currentSegmentTime

      // Update progress bar
      setProgress((t / totalDuration) * 100)

      // Check if we need to advance to the next cue
      const nextIdx = cueIndexRef.current + 1
      if (nextIdx < cues.length && t >= cues[nextIdx].t && !busyRef.current) {
        busyRef.current = true
        cueIndexRef.current = nextIdx
        const cue = cues[nextIdx]
        const fade = fadeRef.current

        // Fade out (0.4s)
        if (fade) {
          fade.style.transition = 'opacity 0.4s ease'
          fade.style.opacity = '1'
        }

        setTimeout(() => {
          if (!runningRef.current) {
            busyRef.current = false
            return
          }

          // Switch section
          onSectionChange(cue.id)
          window.scrollTo(0, 0)

          // Update subtitle
          setSubtitle(cue.sub)

          // Fade in (0.5s) after brief pause at black
          setTimeout(() => {
            if (fade) {
              fade.style.transition = 'opacity 0.5s ease'
              fade.style.opacity = '0'
            }
            setTimeout(() => {
              busyRef.current = false
            }, 600)
          }, 250)
        }, 450)
      }

      // End check
      if (t >= totalDuration - 1) {
        stopAll()
      }
    }, 300)

    return () => {
      runningRef.current = false
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Fade overlay */}
      <div
        ref={fadeRef}
        className="fixed inset-0 z-[250] pointer-events-none"
        style={{
          background: 'var(--pres-bg, #0a0f0d)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Subtitle bar */}
      <SubtitleBar text={subtitle} visible />

      {/* Stop button */}
      <button
        onClick={stopAll}
        className="fixed top-[66px] right-5 z-[301] px-4 py-[7px] rounded-lg text-[0.72rem] cursor-pointer"
        style={{
          border: '1px solid rgba(45,138,86,0.3)',
          background: 'rgba(10,15,13,0.92)',
          color: '#8a9b8f',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(8px)',
        }}
      >
        Detener
      </button>
    </>
  )
}
