import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('presentations')
    .insert({
      user_id: user.id,
      title: body.title,
      company_name: body.company_name ?? null,
      company_description: body.company_description ?? null,
      target_audience: body.target_audience ?? null,
      selling_points: body.selling_points ?? null,
      pricing_info: body.pricing_info ?? null,
      additional_context: body.additional_context ?? null,
      language: body.language ?? 'es',
      theme_primary: body.theme_primary ?? '#6366f1',
      theme_accent: body.theme_accent ?? '#f59e0b',
      theme_bg: body.theme_bg ?? '#0f172a',
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data, { status: 201 })
}
