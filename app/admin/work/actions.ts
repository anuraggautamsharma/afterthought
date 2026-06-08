'use server'

import { createProject, updateProject, deleteProject, countProjects, type ProjectInput } from '@/lib/projects'
import { WORK_SEED } from '@/lib/work-seed'
import { slugify } from '@/lib/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProjectAction(
  id: string | null,
  data: ProjectInput
): Promise<{ id?: string; error?: string }> {
  try {
    const slug = data.slug?.trim() || slugify((data.title ?? '').replace(/\*/g, ''))
    const input: ProjectInput = { ...data, slug }

    if (id) {
      await updateProject(id, input)
      revalidatePath('/work')
      revalidatePath(`/work/${slug}`)
      return { id }
    } else {
      const project = await createProject(input)
      revalidatePath('/work')
      revalidatePath(`/work/${project.slug}`)
      return { id: project.id }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save project' }
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id)
    revalidatePath('/work')
  } catch {
    // continue to redirect regardless
  }
  redirect('/admin/work')
}

/** One-time migration: seed the projects table from the legacy case studies. */
export async function seedProjectsAction(): Promise<{ error?: string; count?: number }> {
  try {
    const existing = await countProjects()
    if (existing > 0) return { error: 'Projects already exist — import skipped.' }

    for (const project of WORK_SEED) {
      await createProject(project)
    }
    revalidatePath('/work')
    revalidatePath('/admin/work')
    return { count: WORK_SEED.length }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Import failed' }
  }
}

export async function bulkDeleteProjectsAction(ids: string[]) {
  await Promise.all(ids.map(id => deleteProject(id).catch(() => {})))
  revalidatePath('/admin/work'); revalidatePath('/work')
}

export async function bulkSetProjectStatusAction(ids: string[], status: 'published' | 'draft') {
  await Promise.all(ids.map(id => updateProject(id, { status }).catch(() => {})))
  revalidatePath('/admin/work'); revalidatePath('/work')
}
