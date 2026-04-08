import { createServerSupabase } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/slug'

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

  // Fetch presentation
  const { data: presentation, error: fetchError } = await supabase
    .from('presentations')
    .select('id, title, slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const slug = presentation.slug ?? generateSlug(presentation.title)

  const { data, error } = await supabase
    .from('presentations')
    .update({ status: 'published', slug })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/p/${slug}`

  return Response.json({ ...data, public_url: publicUrl })
}
