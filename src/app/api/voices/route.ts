import type { NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { listVoices } from '@/lib/voice/elevenlabs'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const language = request.nextUrl.searchParams.get('language')

  try {
    const voices = await listVoices()

    const filtered = language
      ? voices.filter((v) => {
          const voiceLang = v.labels?.language ?? ''
          return voiceLang.toLowerCase().includes(language.toLowerCase())
        })
      : voices

    return Response.json(
      filtered.map((v) => ({
        voice_id: v.voice_id,
        name: v.name,
        labels: v.labels,
      }))
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch voices'
    return Response.json({ error: message }, { status: 500 })
  }
}
