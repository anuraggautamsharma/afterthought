import { redirect } from 'next/navigation'

// Responses now live in the unified Inbox hub, grouped by form.
export default async function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/admin/inbox?form=${id}&view=table`)
}
