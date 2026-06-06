import { getAllJobs } from '@/lib/jobs'
import JobsList from '@/components/admin/JobsList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Jobs — Afterthought CMS' }

export default async function JobsPage() {
  let jobs: Awaited<ReturnType<typeof getAllJobs>> = []
  let dbError: string | null = null
  try {
    jobs = await getAllJobs()
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  return (
    <>
      {dbError && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '13px', color: '#991b1b' }}>
          <strong>Database error:</strong> {dbError}
        </div>
      )}
      <JobsList jobs={jobs} />
    </>
  )
}
