'use server'

import { createService, updateService, deleteService, countServices, type ServiceInput } from '@/lib/services'
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
