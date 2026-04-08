import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const supabase = getServiceSupabase()
  const body = await request.json()
  const { presentation_id, event, section_id, time_seconds } = body as {
    presentation_id: string
    event: 'view' | 'section' | 'voice_start' | 'voice_complete' | 'complete'
    section_id?: string
    time_seconds?: number
  }

  if (!presentation_id || !event) {
    return Response.json(
      { error: 'presentation_id and event are required' },
      { status: 400 }
    )
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = headersList.get('user-agent') ?? null
  const referrer = headersList.get('referer') ?? null

  if (event === 'view') {
    // Create a new view record
    const { error } = await supabase
      .from('presentation_views')
      .insert({
        presentation_id,
        viewer_ip: ip,
        user_agent: userAgent,
        referrer,
        sections_viewed: [],
        max_section_reached: 0,
        total_time_seconds: 0,
        voice_started: false,
        voice_completed: false,
        completed: false,
      })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Increment view_count on the presentation
    const { error: rpcError } = await supabase.rpc('increment_view_count', { p_id: presentation_id })
    if (rpcError) {
      // Fallback: manual increment if RPC doesn't exist
      const { data: pres } = await supabase
        .from('presentations')
        .select('view_count')
        .eq('id', presentation_id)
        .single()
      if (pres) {
        await supabase
          .from('presentations')
          .update({ view_count: (pres.view_count ?? 0) + 1 })
          .eq('id', presentation_id)
      }
    }

    return Response.json({ success: true })
  }

  // For other events, update the most recent view from this IP
  const { data: existingView } = await supabase
    .from('presentation_views')
    .select('id, sections_viewed, max_section_reached')
    .eq('presentation_id', presentation_id)
    .eq('viewer_ip', ip ?? '')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!existingView) {
    return Response.json({ error: 'No active view session' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {}

  if (event === 'section' && section_id) {
    const viewed = existingView.sections_viewed ?? []
    if (!viewed.includes(section_id)) {
      updateData.sections_viewed = [...viewed, section_id]
    }
    updateData.max_section_reached = Math.max(
      existingView.max_section_reached ?? 0,
      (viewed.length)
    )
  }

  if (event === 'voice_start') {
    updateData.voice_started = true
  }

  if (event === 'voice_complete') {
    updateData.voice_completed = true
  }

  if (event === 'complete') {
    updateData.completed = true
  }

  if (time_seconds !== undefined) {
    updateData.total_time_seconds = time_seconds
  }

  if (Object.keys(updateData).length > 0) {
    await supabase
      .from('presentation_views')
      .update(updateData)
      .eq('id', existingView.id)
  }

  return Response.json({ success: true })
}
