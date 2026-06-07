import { notFound } from 'next/navigation'
import { getSubmissionById } from '@/lib/submissions'
import { getFormById, getFields, type FormField, type Form } from '@/lib/forms'
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

  return <InboxDetail submission={submission} form={form} fields={fields} />
}
