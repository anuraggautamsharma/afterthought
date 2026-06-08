import { notFound } from 'next/navigation'
import { getSubmissionById } from '@/lib/submissions'
import { getFormById, getFields, asStoredFiles, type FormField, type Form } from '@/lib/forms'
import { getJobById } from '@/lib/jobs'
import { getSignedFileUrl } from '@/lib/storage'
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

  // Generate short-lived signed download URLs for any uploaded files.
  const fileUrls: Record<string, string> = {}
  const responses = (submission.responses ?? {}) as Record<string, unknown>
  for (const f of fields.filter(ff => ff.type === 'file_upload')) {
    for (const file of asStoredFiles(responses[f.id])) {
      if (file.path && !fileUrls[file.path]) {
        const url = await getSignedFileUrl(file.path).catch(() => null)
        if (url) fileUrls[file.path] = url
      }
    }
  }

  return (
    <InboxDetail
      submission={submission}
      form={form}
      fields={fields}
      jobTitle={jobTitle}
      jobSlug={jobSlug}
      fileUrls={fileUrls}
    />
  )
}
