/**
 * Get audio duration from an MP3 buffer.
 * Uses a lightweight approach: parse MP3 frames to calculate duration.
 * No native dependencies (no ffmpeg needed in serverless).
 */
export async function getAudioDuration(buffer: Buffer): Promise<number> {
  // Try using music-metadata if available
  try {
    const mm = await import('music-metadata')
    const metadata = await mm.parseBuffer(buffer, { mimeType: 'audio/mpeg' })
    return metadata.format.duration || 0
  } catch {
    // Fallback: estimate from file size assuming 128kbps
    return (buffer.length * 8) / 128000
  }
}

/**
 * Build a complete voice package for a presentation.
 * Generates audio for each section, measures durations, returns all data.
 */
export interface VoicePackageSection {
  sectionId: string
  audioBuffer: Buffer
  duration: number
  startTime: number
}

export interface VoicePackage {
  sections: VoicePackageSection[]
  totalDuration: number
}

import { generateSectionAudio, VoiceOptions } from './elevenlabs'

export async function buildVoicePackage(
  sections: { id: string; voiceScript: string }[],
  options: VoiceOptions = {}
): Promise<VoicePackage> {
  const result: VoicePackageSection[] = []
  let cumulative = 0

  for (const section of sections) {
    if (!section.voiceScript?.trim()) continue

    const audioBuffer = await generateSectionAudio(section.voiceScript, options)
    const duration = await getAudioDuration(audioBuffer)

    result.push({
      sectionId: section.id,
      audioBuffer,
      duration,
      startTime: cumulative,
    })

    cumulative += duration
  }

  return {
    sections: result,
    totalDuration: cumulative,
  }
}
