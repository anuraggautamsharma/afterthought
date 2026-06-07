import { notFound } from 'next/navigation'
import { getFormWithContent } from '@/lib/forms'
import FormBuilder from '@/components/admin/forms/FormBuilder'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const data = await getFormWithContent(id)
  return {
    title: data ? `${data.form.title || 'Untitled form'} — Forms` : 'Form not found',
  }
}

export default async function FormEditPage({ params }: Props) {
  const { id } = await params
  const data = await getFormWithContent(id)

  if (!data) {
    notFound()
  }

  return <FormBuilder initial={data} />
}
