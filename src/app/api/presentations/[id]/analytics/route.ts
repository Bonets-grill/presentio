import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
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
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Fetch all views for this presentation
  const { data: views, error: viewsError } = await supabase
    .from('presentation_views')
    .select('*')
    .eq('presentation_id', id)

  if (viewsError) {
    return Response.json({ error: viewsError.message }, { status: 500 })
  }

  const allViews = views ?? []
  const totalViews = allViews.length

  const avgTime = totalViews > 0
    ? allViews.reduce((sum, v) => sum + (v.total_time_seconds ?? 0), 0) / totalViews
    : 0

  const completedCount = allViews.filter((v) => v.completed).length
  const completionRate = totalViews > 0 ? completedCount / totalViews : 0

  const voiceStartCount = allViews.filter((v) => v.voice_started).length
  const voiceStartRate = totalViews > 0 ? voiceStartCount / totalViews : 0

  // Views by day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const viewsByDay: Record<string, number> = {}
  for (const v of allViews) {
    const day = v.created_at?.slice(0, 10)
    if (day && new Date(day) >= thirtyDaysAgo) {
      viewsByDay[day] = (viewsByDay[day] ?? 0) + 1
    }
  }

  return Response.json({
    total_views: totalViews,
    avg_time: Math.round(avgTime * 100) / 100,
    completion_rate: Math.round(completionRate * 1000) / 1000,
    voice_start_rate: Math.round(voiceStartRate * 1000) / 1000,
    views_by_day: viewsByDay,
  })
}
