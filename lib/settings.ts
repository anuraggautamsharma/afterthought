import { supabase } from './supabase'

export interface SiteSettings {
  // Availability / status
  status_short: string   // e.g. "Open for briefs"
  status_long: string    // e.g. "Currently reading briefs for Summer 2026"
  location: string       // e.g. "Bangalore"

  // Contact
  email_general: string
  email_press: string
  email_anurag: string
  email_tina: string
  studio_address: string
  studio_hours: string

  // Social links (empty string = hidden)
  social_instagram: string
  social_linkedin: string
  social_behance: string
  social_medium: string
}

// Defaults mirror the current hardcoded site copy, so the site
// renders correctly even before any settings are saved.
export const DEFAULT_SETTINGS: SiteSettings = {
  status_short: 'Open for briefs',
  status_long: 'Currently reading briefs for Summer 2026',
  location: 'Bangalore',

  email_general: 'hello@afterthought.studio',
  email_press: 'press@afterthought.studio',
  email_anurag: 'anurag@afterthought.studio',
  email_tina: 'tina@afterthought.studio',
  studio_address: '100 Feet Road, Indiranagar, Bangalore 560038',
  studio_hours: 'IST · We answer on a working week',

  social_instagram: '',
  social_linkedin: '',
  social_behance: '',
  social_medium: '',
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single()

    if (error || !data?.data) return DEFAULT_SETTINGS
    // Merge so any newly-added fields fall back to defaults
    return { ...DEFAULT_SETTINGS, ...(data.data as Partial<SiteSettings>) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function updateSettings(input: SiteSettings): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, data: input, updated_at: new Date().toISOString() })
  if (error) throw error
}
