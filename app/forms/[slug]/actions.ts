'use server'

import { getFormBySlug, getFields } from '@/lib/forms'
import { createSubmission } from '@/lib/submissions'
import { uploadFormFile, FORM_UPLOAD_HARD_CAP_MB, type UploadedFileMeta } from '@/lib/storage'

export interface UploadResult {
  ok: boolean
  file?: UploadedFileMeta
  error?: string
}

/**
 * Uploads a single file selected in a form's file field to private storage.
 * Enforces the field's size limit (capped at the global hard cap). Returns the
 * stored file's metadata (incl. path) to embed in the submission.
 */
export async function uploadFormFileAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file')
    if (!(file instanceof File)) return { ok: false, error: 'No file received' }

    const formId = String(formData.get('formId') ?? '')
    const requestedMb = Number(formData.get('maxMb') ?? 10) || 10
    const limitMb = Math.min(requestedMb, FORM_UPLOAD_HARD_CAP_MB)

    if (file.size > limitMb * 1024 * 1024) {
      return { ok: false, error: `File is too large. Max ${limitMb} MB.` }
    }
    if (file.size === 0) return { ok: false, error: 'File is empty' }

    const meta = await uploadFormFile(formId, file)
    return { ok: true, file: meta }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Upload failed' }
  }
}

export interface SubmitResult {
  ok: boolean
  errors?: Record<string, string>
}

export async function submitFormAction(
  formId: string,
  slug: string,
  responses: Record<string, unknown>,
  jobId?: string | null
): Promise<SubmitResult> {
  try {
    const [form, fields] = await Promise.all([
      getFormBySlug(slug),
      getFields(formId),
    ])

    if (!form) {
      return { ok: false, errors: { _form: 'Form not found' } }
    }

    // Validate required fields
    const errors: Record<string, string> = {}
    for (const field of fields) {
      if (!field.required) continue
      const val = responses[field.id]
      const isEmpty =
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0)
      if (isEmpty) {
        errors[field.id] = 'This field is required'
      }
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors }
    }

    // Extract name and email from responses by matching field types
    let name = ''
    let email = ''

    for (const field of fields) {
      const val = responses[field.id]
      if (!val || typeof val !== 'string') continue
      if (field.type === 'short_text' && !name) {
        // Heuristic: first short_text field is likely a name
        const labelLower = field.label.toLowerCase()
        if (labelLower.includes('name')) {
          name = val
        }
      }
      if (field.type === 'email' && !email) {
        email = val
      }
    }

    // Fallback: pick first short_text if no name found yet
    if (!name) {
      for (const field of fields) {
        if (field.type === 'short_text' && responses[field.id]) {
          name = String(responses[field.id])
          break
        }
      }
    }

    await createSubmission({
      type: form.category ?? 'general',
      name,
      email,
      subject: form.title,
      form_id: formId,
      job_id: jobId ?? null,
      responses,
    })

    // Fire webhook if configured
    if (form.webhook_url) {
      try {
        await fetch(form.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: formId,
            form_title: form.title,
            responses,
            submitted_at: new Date().toISOString(),
          }),
        })
      } catch {
        // Webhook failure is non-fatal
      }
    }

    return { ok: true }
  } catch (err) {
    console.error('submitFormAction error:', err)
    return { ok: false, errors: { _form: 'Submission failed. Please try again.' } }
  }
}
