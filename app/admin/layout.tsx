import './admin.css'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Afterthought CMS' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await getSession()
  } catch {}

  if (!session) {
    return (
      <div className="admin-shell">
        <div className="admin-main">{children}</div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
