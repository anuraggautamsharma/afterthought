'use server'

import { createSubmission, type SubmissionInput } from '@/lib/submissions'
import { revalidatePath } from 'next/cache'

export async function submitForm(input: SubmissionInput): Promise<{ ok: boolean; error?: string }> {
  // Basic guard — an email or a name is the minimum we'll store.
  if (!input.email && !input.name) {
    return { ok: false, error: 'Please add your email.' }
  }
  try {
    await createSubmission(input)
    revalidatePath('/admin/inbox')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Something went wrong. Please try again.' }
  }
}
