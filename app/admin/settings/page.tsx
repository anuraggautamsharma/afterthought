import { getSettings } from '@/lib/settings'
import SettingsForm from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings — Afterthought CMS' }

export default async function SettingsPage() {
  const settings = await getSettings()
  return <SettingsForm initial={settings} />
}
