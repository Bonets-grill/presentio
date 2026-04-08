import { createServerSupabase } from '@/lib/supabase/server'
import { generatePresentation } from '@/lib/ai/generate-presentation'

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

  // Fetch the presentation
  const { data: presentation, error: fetchError } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !presentation) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Update status to generating
  await supabase
    .from('presentations')
    .update({ status: 'generating' })
    .eq('id', id)

  try {
    const result = await generatePresentation({
      companyName: presentation.company_name ?? '',
      companyDescription: presentation.company_description ?? '',
      targetAudience: presentation.target_audience ?? '',
      sellingPoints: presentation.selling_points ?? [],
      pricingInfo: presentation.pricing_info ?? '',
      additionalContext: presentation.additional_context ?? undefined,
      language: presentation.language,
    })

    // Delete existing sections for this presentation
    await supabase
      .from('sections')
      .delete()
      .eq('presentation_id', id)

    // Insert generated sections
    const sectionsToInsert = result.sections.map((s) => ({
      presentation_id: id,
      order: s.order,
      section_type: s.section_type,
      nav_label: s.nav_label,
      title: s.title,
      subtitle: s.subtitle,
      label: s.label,
      content_json: s.content_json,
      voice_script: s.voice_script,
    }))

    const { data: sections, error: insertError } = await supabase
      .from('sections')
      .insert(sectionsToInsert)
      .select()

    if (insertError) {
      throw new Error(insertError.message)
    }

    // Update presentation status and title if AI suggested one
    await supabase
      .from('presentations')
      .update({
        status: 'ready',
        ...(result.title ? { title: result.title } : {}),
      })
      .eq('id', id)

    return Response.json(sections)
  } catch (err) {
    // Revert status on failure
    await supabase
      .from('presentations')
      .update({ status: 'draft' })
      .eq('id', id)

    const message = err instanceof Error ? err.message : 'Generation failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
