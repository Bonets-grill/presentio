import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Upload an audio buffer to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadAudio(
  buffer: Buffer,
  path: string, // e.g. 'presentations/{id}/sections/{sectionId}.mp3'
  bucket = 'presentation-audio'
): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload error: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
