'use client'

import { deletePostAction } from '@/app/admin/posts/actions'

export default function DeletePostButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        if (!confirm('Delete this post?')) return
        await deletePostAction(id)
      }}
      style={{ display: 'inline' }}
    >
      <button type="submit" className="admin-btn-ghost admin-btn-ghost--danger">
        Delete
      </button>
    </form>
  )
}
