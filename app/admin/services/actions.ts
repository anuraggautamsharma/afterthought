'use server'

import { createService, updateService, deleteService, countServices, getServices, type ServiceInput } from '@/lib/services'
import { SERVICES_SEED } from '@/lib/services-seed'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveServiceAction(
  id: string | null,
  data: ServiceInput
): Promise<{ id?: string; error?: string }> {
  try {
    if (id) {
      await updateService(id, data)
      revalidatePath('/services')
      return { id }
    } else {
      const svc = await createService(data)
      revalidatePath('/services')
      return { id: svc.id }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save service' }
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await deleteService(id)
    revalidatePath('/services')
  } catch {
    // continue
  }
  redirect('/admin/services')
}

export async function reorderServiceAction(id: string, direction: 'up' | 'down'): Promise<void> {
  const all = await getServices()
  const idx = all.findIndex(s => s.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return
  const a = all[idx], b = all[swapIdx]
  await Promise.all([
    updateService(a.id, { sort_order: b.sort_order }),
    updateService(b.id, { sort_order: a.sort_order }),
  ])
  revalidatePath('/services')
  revalidatePath('/admin/services')
}

export async function seedServicesAction(): Promise<{ error?: string; count?: number }> {
  try {
    const existing = await countServices()
    if (existing > 0) return { error: 'Services already exist — import skipped.' }
    for (const s of SERVICES_SEED) await createService(s)
    revalidatePath('/services')
    revalidatePath('/admin/services')
    return { count: SERVICES_SEED.length }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Import failed' }
  }
}

export async function bulkDeleteServicesAction(ids: string[]) {
  await Promise.all(ids.map(id => deleteService(id).catch(() => {})))
  revalidatePath('/admin/services'); revalidatePath('/services')
}
