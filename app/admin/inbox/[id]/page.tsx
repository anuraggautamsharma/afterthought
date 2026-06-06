import { notFound } from 'next/navigation'
import { getSubmissionById } from '@/lib/submissions'
import InboxDetail from '@/components/admin/InboxDetail'

export const dynamic = 'force-dynamic'

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const submission = await getSubmissionById(id)
  if (!submission) notFound()
  return <InboxDetail submission={submission} />
}
