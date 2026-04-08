import { createServerSupabase } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { presentation_id, section_ids } = body as {
    presentation_id: string
    section_ids: string[]
  }

  if (!presentation_id || !Array.isArray(section_ids)) {
    return Response.json(
      { error: 'presentation_id and section_ids[] are required' },
      { status: 400 }
    )
  }

  // Verify ownership
  const { data: presentation } = await supabase
    .from('presentations')
    .select('id')
    .eq('id', presentation_id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Update order for each section
  const updates = section_ids.map((sectionId, index) =>
    supabase
      .from('sections')
      .update({ order: index })
      .eq('id', sectionId)
      .eq('presentation_id', presentation_id)
  )

  await Promise.all(updates)

  return Response.json({ success: true })
}
