import { getUsers } from '@/lib/users'
import { getSession } from '@/lib/auth'
import UsersManager from '@/components/admin/UsersManager'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Users — Afterthought CMS' }

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    getUsers().catch(() => []),
    getSession().catch(() => null),
  ])
  const ownerEmail = (process.env.ADMIN_EMAIL ?? '').toLowerCase()

  return (
    <UsersManager
      users={users}
      ownerEmail={ownerEmail}
      currentEmail={(session?.email ?? '').toLowerCase()}
    />
  )
}
