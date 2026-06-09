'use server'


import { requireSession } from '@/lib/auth'
import { updateSettings, type SiteSettings } from '@/lib/settings'
import { revalidatePath } from 'next/cache'

export async function saveSettingsAction(
  settings: SiteSettings
): Promise<{ error?: string }> {
  await requireSession()
  try {
    await updateSettings(settings)
    // Settings appear in the root layout (Nav/Footer) and several pages,
    // so revalidate everything under the root layout.
    revalidatePath('/', 'layout')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save settings' }
  }
}
