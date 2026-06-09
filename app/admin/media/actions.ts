'use server'


import { requireSession } from '@/lib/auth'
import { getSupabase } from '@/lib/supabase'

const BUCKET = 'media'

function getClient() {
  return getSupabase()
}

async function ensureBucket() {
  const supabase = getClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }
}

export async function uploadMediaAction(
  formData: FormData
): Promise<{ url: string; name: string } | { error: string }> {
  await requireSession()
  try {
    await ensureBucket()
    const supabase = getClient()
    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: 'No file provided' }

    const ext  = file.name.split('.').pop()
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const name = `${base}-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) return { error: error.message }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(name)
    return { url: publicUrl, name }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed' }
  }
}

export async function listMediaAction(): Promise<Array<{
  name: string
  url: string
  size: number
  createdAt: string
}>> {
  await requireSession()
  try {
    await ensureBucket()
    const supabase = getClient()
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (error || !data) return []

    return data
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        size: f.metadata?.size ?? 0,
        createdAt: f.created_at ?? '',
      }))
  } catch {
    return []
  }
}

export async function deleteMediaAction(
  filename: string
): Promise<{ success: true } | { error: string }> {
  await requireSession()
  try {
    const supabase = getClient()
    const { error } = await supabase.storage.from(BUCKET).remove([filename])
    if (error) return { error: error.message }
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Delete failed' }
  }
}
