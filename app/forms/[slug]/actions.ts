'use server'

import { getFormBySlug, getFields } from '@/lib/forms'
import { createSubmission } from '@/lib/submissions'

export interface SubmitResult {
  ok: boolean
  errors?: Record<string, string>
}

export async function submitFormAction(
  formId: string,
  slug: string,
  responses: Record<string, unknown>
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
