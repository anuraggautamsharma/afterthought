import { getTeam } from '@/lib/team'
import TeamList from '@/components/admin/TeamList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Team — Afterthought CMS' }

export default async function AdminTeamPage() {
  let team: Awaited<ReturnType<typeof getTeam>> = []
  let dbError: string | null = null
  try {
    team = await getTeam()
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
      <TeamList team={team} />
    </>
  )
}
