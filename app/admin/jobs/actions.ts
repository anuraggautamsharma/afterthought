'use server'

import { createJob, updateJob, deleteJob, countJobs, getAllJobs, getJobById, type JobInput } from '@/lib/jobs'
import { createFullForm, getAllForms, duplicateForm } from '@/lib/forms'
import { applicationFormSpec } from '@/lib/forms-seed'
import { roles } from '@/lib/roles'
import { slugify } from '@/lib/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/** Creates a dedicated application form for a job and links it. Returns form id. */
async function ensureJobApplicationForm(jobId: string, jobTitle: string): Promise<string> {
  const form = await createFullForm(applicationFormSpec(jobTitle))
  await updateJob(jobId, { application_form_id: form.id })
  return form.id
}

/** Creates + links an application form for an existing job (editor button). */
export async function createApplicationFormAction(
  jobId: string
): Promise<{ formId?: string; error?: string }> {
  try {
    const job = await getJobById(jobId)
    if (!job) return { error: 'Job not found' }
    if (job.application_form_id) return { formId: job.application_form_id }
    const formId = await ensureJobApplicationForm(jobId, job.title)
    revalidatePath(`/admin/jobs/${jobId}`)
    revalidatePath('/admin/forms')
    return { formId }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create form' }
  }
}

/** Always creates a brand-new dedicated form and links it (picker "Create new"). */
export async function createNewApplicationFormAction(
  jobId: string
): Promise<{ formId?: string; error?: string }> {
  try {
    const job = await getJobById(jobId)
    if (!job) return { error: 'Job not found' }
    const formId = await ensureJobApplicationForm(jobId, job.title)
    revalidatePath(`/admin/jobs/${jobId}`)
    revalidatePath('/admin/forms')
    return { formId }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create form' }
  }
}

/** Minimal form list for the job's "Application form" picker. */
export interface FormPickerOption {
  id: string
  title: string
  category: string
  status: 'draft' | 'published' | 'closed'
}

export async function listFormsForPickerAction(): Promise<FormPickerOption[]> {
  try {
    const forms = await getAllForms()
    return forms.map(f => ({
      id: f.id,
      title: f.title || 'Untitled form',
      category: f.category,
      status: f.status,
    }))
  } catch {
    return []
  }
}

/** Attaches (or clears, with null) an existing form as the job's application form. */
export async function setJobApplicationFormAction(
  jobId: string,
  formId: string | null
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateJob(jobId, { application_form_id: formId })
    revalidatePath(`/admin/jobs/${jobId}`)
    revalidatePath('/admin/forms')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update job' }
  }
}

/** Duplicates an existing form and links the copy to this job (specialise flow). */
export async function duplicateFormForJobAction(
  jobId: string,
  sourceFormId: string
): Promise<{ formId?: string; error?: string }> {
  try {
    const copy = await duplicateForm(sourceFormId)
    await updateJob(jobId, { application_form_id: copy.id })
    revalidatePath(`/admin/jobs/${jobId}`)
    revalidatePath('/admin/forms')
    return { formId: copy.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to duplicate form' }
  }
}

export async function saveJobAction(
  id: string | null,
  data: JobInput
): Promise<{ id?: string; error?: string }> {
  try {
    const slug = data.slug?.trim() || slugify(data.title ?? '')
    const input: JobInput = { ...data, slug }

    if (id) {
      await updateJob(id, input)
      revalidatePath('/careers')
      revalidatePath(`/careers/${slug}`)
      return { id }
    } else {
      const job = await createJob(input)
      // Give every new job its own dedicated application form.
      try {
        await ensureJobApplicationForm(job.id, job.title)
      } catch (e) {
        console.error('[saveJobAction] failed to create application form:', e)
      }
      revalidatePath('/careers')
      revalidatePath(`/careers/${job.slug}`)
      revalidatePath('/admin/forms')
      return { id: job.id }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save job' }
  }
}

export async function deleteJobAction(id: string) {
  try {
    await deleteJob(id)
    revalidatePath('/careers')
  } catch {
    // continue to redirect regardless
  }
  redirect('/admin/jobs')
}

export async function reorderJobAction(id: string, direction: 'up' | 'down'): Promise<void> {
  const all = await getAllJobs()
  const idx = all.findIndex(j => j.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return
  const a = all[idx], b = all[swapIdx]
  await Promise.all([
    updateJob(a.id, { sort_order: b.sort_order }),
    updateJob(b.id, { sort_order: a.sort_order }),
  ])
  revalidatePath('/careers')
  revalidatePath('/admin/jobs')
}

/** One-time migration: seed the jobs table from the legacy hardcoded roles. */
export async function seedJobsAction(): Promise<{ error?: string; count?: number }> {
  try {
    const existing = await countJobs()
    if (existing > 0) return { error: 'Jobs already exist — import skipped.' }

    let i = 0
    for (const r of roles) {
      await createJob({
        title: r.title,
        slug: r.id,
        type: r.type,
        location: r.location,
        summary: r.summary,
        description: r.description,
        what_youll_do: r.whatYoullDo,
        looking_for: r.lookingFor,
        nice_to_have: r.niceToHave,
        why_afterthought: r.whyAfterThought,
        status: 'open',
        sort_order: i++,
      })
    }
    revalidatePath('/careers')
    revalidatePath('/admin/jobs')
    return { count: roles.length }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Import failed' }
  }
}

export async function bulkDeleteJobsAction(ids: string[]) {
  await Promise.all(ids.map(id => deleteJob(id).catch(() => {})))
  revalidatePath('/admin/jobs'); revalidatePath('/careers')
}

export async function bulkSetJobStatusAction(ids: string[], status: 'open' | 'closed') {
  await Promise.all(ids.map(id => updateJob(id, { status }).catch(() => {})))
  revalidatePath('/admin/jobs'); revalidatePath('/careers')
}
