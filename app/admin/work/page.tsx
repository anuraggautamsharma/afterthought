import { getAllProjects } from '@/lib/projects'
import ProjectsList from '@/components/admin/ProjectsList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Work — Afterthought CMS' }

export default async function AdminWorkPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = []
  let dbError: string | null = null
  try {
    projects = await getAllProjects()
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
      <ProjectsList projects={projects} />
    </>
  )
}
