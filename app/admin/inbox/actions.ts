'use server'

import { setSubmissionRead, setSubmissionArchived, deleteSubmission, getSubmissionById } from '@/lib/submissions'
import { collectStoredFilePaths } from '@/lib/forms'
import { deleteFormFiles } from '@/lib/storage'
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
    // Remove any uploaded files from storage first, then the row itself.
    const sub = await getSubmissionById(id).catch(() => null)
    if (sub) {
      const paths = collectStoredFilePaths(sub.responses as Record<string, unknown>)
      if (paths.length > 0) await deleteFormFiles(paths).catch(() => {})
    }
    await deleteSubmission(id)
    revalidatePath('/admin/inbox')
  } catch {
    // continue
  }
  redirect('/admin/inbox')
}

// ── Bulk actions (stay on the page) ────────────────────────────────────────────

export async function bulkMarkReadAction(ids: string[], read: boolean) {
  await Promise.all(ids.map(id => setSubmissionRead(id, read).catch(() => {})))
  revalidatePath('/admin/inbox')
}

export async function bulkArchiveAction(ids: string[], archived: boolean) {
  await Promise.all(ids.map(id => setSubmissionArchived(id, archived).catch(() => {})))
  revalidatePath('/admin/inbox')
}

export async function bulkDeleteSubmissionsAction(ids: string[]) {
  await Promise.all(ids.map(async id => {
    try {
      const sub = await getSubmissionById(id).catch(() => null)
      if (sub) {
        const paths = collectStoredFilePaths(sub.responses as Record<string, unknown>)
        if (paths.length > 0) await deleteFormFiles(paths).catch(() => {})
      }
      await deleteSubmission(id)
    } catch {
      // continue
    }
  }))
  revalidatePath('/admin/inbox')
}
