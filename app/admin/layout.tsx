import './admin.css'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { countUnread } from '@/lib/submissions'
import ToastContainer from '@/components/admin/ToastContainer'
import ConfirmModal from '@/components/admin/ConfirmModal'

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

  let unread = 0
  try {
    unread = await countUnread()
  } catch {}

  return (
    <div className="admin-shell">
      <AdminSidebar unread={unread} />
      <div className="admin-main">
        <div className="admin-content">{children}</div>
      </div>
      <ToastContainer />
      <ConfirmModal />
    </div>
  )
}
