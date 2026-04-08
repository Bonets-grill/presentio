import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { EditorLayout } from '@/components/editor/editor-layout'
import type { Presentation, Section } from '@/types/database'

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch presentation
  const { data: presentation, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !presentation) {
    redirect('/dashboard')
  }

  // Fetch sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('presentation_id', id)
    .order('order', { ascending: true })

  return (
    <EditorLayout
      initialPresentation={presentation as Presentation}
      initialSections={(sections ?? []) as Section[]}
    />
  )
}
