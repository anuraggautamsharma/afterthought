import './admin.css'
import { getSession } from '@/lib/auth'

import AdminTopbar from '@/components/admin/AdminTopbar'

export const metadata = { title: 'Afterthought CMS' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-content">{children}</div>
    </div>
  )
}
