import JobForm from '@/components/admin/JobForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'New job — Afterthought CMS' }

export default function NewJobPage() {
  return <JobForm job={null} />
}
