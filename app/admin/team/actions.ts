'use server'


import { requireSession } from '@/lib/auth'
import { createTeamMember, updateTeamMember, deleteTeamMember, countTeam, getTeam, type TeamInput } from '@/lib/team'
import { TEAM_SEED } from '@/lib/team-seed'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveTeamAction(
  id: string | null,
  data: TeamInput
): Promise<{ id?: string; error?: string }> {
  await requireSession()
  try {
    if (id) {
      await updateTeamMember(id, data)
      revalidatePath('/studio')
      return { id }
    } else {
      const member = await createTeamMember(data)
      revalidatePath('/studio')
      return { id: member.id }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save team member' }
  }
}

export async function deleteTeamAction(id: string) {
  await requireSession()
  try {
    await deleteTeamMember(id)
    revalidatePath('/studio')
  } catch {
    // continue
  }
  redirect('/admin/team')
}

export async function reorderTeamAction(id: string, direction: 'up' | 'down'): Promise<void> {
  await requireSession()
  const all = await getTeam()
  const idx = all.findIndex(m => m.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return
  const a = all[idx], b = all[swapIdx]
  await Promise.all([
    updateTeamMember(a.id, { sort_order: b.sort_order }),
    updateTeamMember(b.id, { sort_order: a.sort_order }),
  ])
  revalidatePath('/studio')
  revalidatePath('/admin/team')
}

export async function seedTeamAction(): Promise<{ error?: string; count?: number }> {
  await requireSession()
  try {
    const existing = await countTeam()
    if (existing > 0) return { error: 'Team already exists — import skipped.' }
    for (const m of TEAM_SEED) await createTeamMember(m)
    revalidatePath('/studio')
    revalidatePath('/admin/team')
    return { count: TEAM_SEED.length }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Import failed' }
  }
}

export async function bulkDeleteTeamAction(ids: string[]) {
  await requireSession()
  await Promise.all(ids.map(id => deleteTeamMember(id).catch(() => {})))
  revalidatePath('/admin/team'); revalidatePath('/studio'); revalidatePath('/')
}
