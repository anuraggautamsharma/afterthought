import { supabase } from './supabase'

/** Private bucket that holds files uploaded through builder forms. */
export const FORM_UPLOADS_BUCKET = 'form-uploads'

/** Hard ceiling regardless of a field's configured limit. */
export const FORM_UPLOAD_HARD_CAP_MB = 25

export interface UploadedFileMeta {
  name: string
  size: number
  type: string
  path: string
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'file'
}

/**
 * Uploads a file to the private form-uploads bucket and returns its metadata
 * (including the storage path). Throws on failure.
 */
export async function uploadFormFile(formId: string, file: File): Promise<UploadedFileMeta> {
  const path = `${formId || 'misc'}/${crypto.randomUUID()}-${safeName(file.name)}`
  const bytes = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from(FORM_UPLOADS_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
  if (error) throw new Error(error.message)
  return { name: file.name, size: file.size, type: file.type, path }
}

/** Generates a short-lived signed URL so an admin can download a stored file. */
export async function getSignedFileUrl(path: string, expiresInSeconds = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(FORM_UPLOADS_BUCKET)
    .createSignedUrl(path, expiresInSeconds)
  if (error) return null
  return data?.signedUrl ?? null
}
