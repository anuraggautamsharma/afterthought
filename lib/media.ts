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

function extFor(contentType: string): string {
  return (contentType.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg')
}

/** Stores a raw image buffer in the public media bucket and returns its URL. */
async function storeImage(buf: Buffer, contentType: string, baseName?: string): Promise<{ url: string; name: string }> {
  if (!contentType.startsWith('image/')) throw new Error(`Not an image (got ${contentType || 'unknown'})`)
  if (buf.byteLength > MAX_IMAGE_BYTES) throw new Error('Image is larger than 15 MB')
  const base = (baseName || 'image').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 60) || 'image'
  const name = `${base}-${Date.now()}.${extFor(contentType)}`
  await ensureMediaBucket()
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(name, buf, { contentType, upsert: false })
  if (error) throw new Error(error.message)
  return { url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl, name }
}

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
  return storeImage(buf, contentType, baseName)
}

/** Stores raw image bytes (e.g. a rendered hero PNG) in the media bucket. */
export async function uploadImageBuffer(
  buf: Buffer,
  baseName: string,
  contentType = 'image/png',
): Promise<{ url: string; name: string }> {
  return storeImage(buf, contentType, baseName)
}

/**
 * Stores an image supplied as base64 (or a `data:` URI) in the public media
 * bucket. Lets automation upload an image it generated itself — no public URL
 * required. `contentType` is used when the payload is raw base64; for a data
 * URI it is read from the prefix.
 */
export async function uploadImageFromBase64(
  data: string,
  baseName?: string,
  contentType = 'image/png',
): Promise<{ url: string; name: string }> {
  let payload = data.trim()
  let type = contentType
  const m = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(payload)
  if (m) {
    type = m[1] || contentType
    payload = m[3]
  }
  payload = payload.replace(/\s/g, '')
  if (!payload) throw new Error('No image data provided')
  const buf = Buffer.from(payload, 'base64')
  if (buf.byteLength === 0) throw new Error('Could not decode base64 image data')
  return storeImage(buf, type.split(';')[0].trim(), baseName)
}
