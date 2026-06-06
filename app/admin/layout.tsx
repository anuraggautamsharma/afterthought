import './admin.css'
import { getSession } from '@/lib/auth'

import AdminTopbar from '@/components/admin/AdminTopbar'

export const metadata = { title: 'Afterthought CMS' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await getSession()
  } catch {}

  if (!session) {
    return <div className="admin-shell"><div className="admin-content">{children}</div></div>
  }

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-content">{children}</div>
    </div>
  )
}
