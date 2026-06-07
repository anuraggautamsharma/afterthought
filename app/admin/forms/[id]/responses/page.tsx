import { notFound } from 'next/navigation'
import { getFormById, getFields, getFormResponses, type FormField } from '@/lib/forms'
import ResponsesClient from './ResponsesClient'

export default async function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [form, fields, rawResponses] = await Promise.all([
    getFormById(id),
    getFields(id).catch(() => [] as FormField[]),
    getFormResponses(id).catch(() => []),
  ])

  if (!form) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responses = rawResponses as any[]

  return <ResponsesClient form={form} fields={fields} responses={responses} />
}
