import { createServerSupabase } from '@/lib/supabase/server'
import { buildVoicePackage } from '@/lib/voice/audio-processor'
import { uploadAudio } from '@/lib/storage/upload'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: presentation, error: fetchError } = await supabase
    .from('presentations')
    .select('id, voice_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Fetch sections ordered
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('id, voice_script')
    .eq('presentation_id', id)
    .order('order', { ascending: true })

  if (sectionsError || !sections?.length) {
    return Response.json({ error: 'No sections found' }, { status: 400 })
  }

  try {
    const voicePackage = await buildVoicePackage(
      sections.map((s) => ({ id: s.id, voiceScript: s.voice_script ?? '' })),
      { voiceId: presentation.voice_id || undefined }
    )

    // Upload each section's audio and update DB
    for (const item of voicePackage.sections) {
      const audioUrl = await uploadAudio(
        item.audioBuffer,
        `presentations/${id}/sections/${item.sectionId}.mp3`
      )

      await supabase
        .from('sections')
        .update({
          audio_url: audioUrl,
          audio_duration: item.duration,
          audio_start_time: item.startTime,
        })
        .eq('id', item.sectionId)
    }

    // Update presentation total duration
    await supabase
      .from('presentations')
      .update({ audio_duration: voicePackage.totalDuration })
      .eq('id', id)

    return Response.json({
      success: true,
      total_duration: voicePackage.totalDuration,
      sections_processed: voicePackage.sections.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Voice generation failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
