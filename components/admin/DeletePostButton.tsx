'use client'

import { useTransition } from 'react'
import { deletePostAction } from '@/app/admin/posts/actions'
import { openConfirm } from '@/lib/confirmStore'

export default function DeletePostButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const confirmed = await openConfirm({
        title: 'Delete this post?',
        message: 'This cannot be undone.',
        confirmLabel: 'Delete',
        danger: true,
      })
      if (!confirmed) return
      await deletePostAction(id)
    })
  }

  return (
    <button
      type="button"
      className="admin-btn-ghost admin-btn-ghost--danger"
      disabled={pending}
      onClick={handleDelete}
    >
      Delete
    </button>
  )
}
