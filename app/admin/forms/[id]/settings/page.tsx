import { notFound } from 'next/navigation'
import { getFormById } from '@/lib/forms'
import FormSettingsClient from './FormSettingsClient'

export default async function FormSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getFormById(id)
  if (!form) notFound()
  return <FormSettingsClient initialForm={form} />
}
