import { supabase } from './supabase'

/** Public bucket that holds blog/media-library images. */
export const MEDIA_BUCKET = 'media'

async function ensureMediaBucket(): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === MEDIA_BUCKET)) {
    await supabase.storage.createBucket(MEDIA_BUCKET, { public: true })
  }
}

export interface MediaItem {
  name: string
  url: string
  size: number
  createdAt: string
}

/** Lists images already in the media library (most recent first). */
export async function listMedia(limit = 100): Promise<MediaItem[]> {
  await ensureMediaBucket()
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list('', {
    limit,
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error || !data) return []
  return data
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => ({
      name: f.name,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? 0,
      createdAt: f.created_at ?? '',
    }))
}

const MAX_IMAGE_BYTES = 15 * 1024 * 1024 // 15 MB

/**
 * Fetches an external image URL and stores it in the public media bucket,
 * returning the hosted public URL. Lets automation pull in an image and have
 * it served (and optimised) from our own domain.
 */
export async function uploadImageFromUrl(srcUrl: string, baseName?: string): Promise<{ url: string; name: string }> {
  let parsed: URL
  try { parsed = new URL(srcUrl) } catch { throw new Error('Invalid image URL') }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('URL must be http(s)')

  const res = await fetch(srcUrl)
  if (!res.ok) throw new Error(`Could not fetch image (HTTP ${res.status})`)
  const contentType = (res.headers.get('content-type') || '').split(';')[0].trim()
  if (!contentType.startsWith('image/')) throw new Error(`URL is not an image (got ${contentType || 'unknown'})`)

  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.byteLength > MAX_IMAGE_BYTES) throw new Error('Image is larger than 15 MB')

  const ext = (contentType.split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace('svg+xml', 'svg')
  const base = (baseName || 'image').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 60) || 'image'
  const name = `${base}-${Date.now()}.${ext}`

  await ensureMediaBucket()
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(name, buf, { contentType, upsert: false })
  if (error) throw new Error(error.message)

  return { url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl, name }
}
