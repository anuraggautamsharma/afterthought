'use server'

import { setSubmissionRead, setSubmissionArchived, deleteSubmission } from '@/lib/submissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function markReadAction(id: string, read: boolean) {
  try {
    await setSubmissionRead(id, read)
    revalidatePath('/admin/inbox')
    revalidatePath(`/admin/inbox/${id}`)
  } catch {
    // continue
  }
}

export async function archiveAction(id: string, archived: boolean) {
  try {
    await setSubmissionArchived(id, archived)
    revalidatePath('/admin/inbox')
  } catch {
    // continue
  }
  redirect('/admin/inbox')
}

export async function deleteSubmissionAction(id: string) {
  try {
    await deleteSubmission(id)
    revalidatePath('/admin/inbox')
  } catch {
    // continue
  }
  redirect('/admin/inbox')
}
