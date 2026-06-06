import { notFound } from 'next/navigation'
import { getJobById } from '@/lib/jobs'
import JobForm from '@/components/admin/JobForm'

export const dynamic = 'force-dynamic'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) notFound()
  return <JobForm job={job} />
}
