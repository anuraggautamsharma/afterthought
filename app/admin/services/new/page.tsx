import ServiceForm from '@/components/admin/ServiceForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'New service — Afterthought CMS' }

export default function NewServicePage() {
  return <ServiceForm service={null} />
}
