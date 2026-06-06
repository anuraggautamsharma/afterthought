import { getSubmissions } from '@/lib/submissions'
import InboxList from '@/components/admin/InboxList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Inbox — Afterthought CMS' }

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>
}) {
  const { archived } = await searchParams
  const showArchived = archived === '1'

  let submissions: Awaited<ReturnType<typeof getSubmissions>> = []
  let dbError: string | null = null
  try {
    submissions = await getSubmissions({ archived: showArchived })
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  return (
    <>
      {dbError && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '13px', color: '#991b1b' }}>
          <strong>Database error:</strong> {dbError}
          <div style={{ marginTop: '8px', color: '#7f1d1d' }}>If this is the first run, create the <code>submissions</code> table in Supabase.</div>
        </div>
      )}
      <InboxList submissions={submissions} showArchived={showArchived} />
    </>
  )
}
