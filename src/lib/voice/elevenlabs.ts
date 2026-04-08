const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID || '7QQzpAyzlKTVrRzQJmTE'

export interface VoiceOptions {
  voiceId?: string
  speed?: number
  stability?: number
  similarityBoost?: number
}

export async function generateSectionAudio(
  text: string,
  options: VoiceOptions = {}
): Promise<Buffer> {
  const voiceId = options.voiceId || DEFAULT_VOICE_ID

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
          style: 0.3,
          use_speaker_boost: true,
          speed: options.speed ?? 0.85,
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs error ${response.status}: ${err}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

export async function listVoices(): Promise<{ voice_id: string; name: string; labels: Record<string, string> }[]> {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY },
  })
  if (!response.ok) throw new Error('Failed to fetch voices')
  const data = await response.json()
  return data.voices
}
