import { notFound } from 'next/navigation'
import { getSubmissionById } from '@/lib/submissions'
import { getFormById, getFields, type FormField, type Form } from '@/lib/forms'
import { getJobById } from '@/lib/jobs'
import InboxDetail from '@/components/admin/InboxDetail'

export const dynamic = 'force-dynamic'

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const submission = await getSubmissionById(id)
  if (!submission) notFound()

  // If this submission came from a builder form, load the form + fields so we
  // can render answers with their real question labels.
  let form: Form | null = null
  let fields: FormField[] = []
  if (submission.form_id) {
    ;[form, fields] = await Promise.all([
      getFormById(submission.form_id).catch(() => null),
      getFields(submission.form_id).catch(() => [] as FormField[]),
    ])
  }

  // If it came in through a job's application form, resolve the job title.
  let jobTitle: string | null = null
  let jobSlug: string | null = null
  if (submission.job_id) {
    const job = await getJobById(submission.job_id).catch(() => null)
    if (job) { jobTitle = job.title; jobSlug = job.slug }
  }

  return <InboxDetail submission={submission} form={form} fields={fields} jobTitle={jobTitle} jobSlug={jobSlug} />
}
