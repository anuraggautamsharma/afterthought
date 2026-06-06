import { notFound } from 'next/navigation'
import { getServiceById } from '@/lib/services'
import ServiceForm from '@/components/admin/ServiceForm'

export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceById(id)
  if (!service) notFound()
  return <ServiceForm service={service} />
}
