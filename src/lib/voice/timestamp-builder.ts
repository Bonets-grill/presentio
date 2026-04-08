export interface TimestampCue {
  t: number
  id: string
  sub: string
}

/**
 * Build the timestamp map (obCues array) from section audio data.
 * This is the data structure that drives the voice-synced onboarding.
 */
export function buildTimestampMap(
  sections: {
    id: string
    navLabel: string
    audioDuration: number | null
    audioStartTime: number | null
  }[]
): TimestampCue[] {
  return sections
    .filter(s => s.audioStartTime !== null)
    .map(s => ({
      t: s.audioStartTime!,
      id: s.id,
      sub: s.navLabel,
    }))
}
