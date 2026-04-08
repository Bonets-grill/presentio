import { createServerSupabase } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the section belongs to a presentation owned by the user
  const { data: section, error: fetchError } = await supabase
    .from('sections')
    .select('id, presentation_id')
    .eq('id', id)
    .single()

  if (fetchError || !section) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: presentation } = await supabase
    .from('presentations')
    .select('id')
    .eq('id', section.presentation_id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('sections')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership through presentation
  const { data: section } = await supabase
    .from('sections')
    .select('id, presentation_id')
    .eq('id', id)
    .single()

  if (!section) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: presentation } = await supabase
    .from('presentations')
    .select('id')
    .eq('id', section.presentation_id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
