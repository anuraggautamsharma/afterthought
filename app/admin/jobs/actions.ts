'use server'

import { createJob, updateJob, deleteJob, countJobs, type JobInput } from '@/lib/jobs'
import { roles } from '@/lib/roles'
import { slugify } from '@/lib/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
      revalidatePath('/careers')
      revalidatePath(`/careers/${job.slug}`)
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
