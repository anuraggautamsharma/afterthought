'use client'

import { useTransition } from 'react'
import Icon from '@/components/Icon'
import { deleteFormFromListAction } from '@/app/admin/forms/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'

interface Props {
  formId: string
  title: string
  isSystem?: boolean
}

export default function DeleteFormButton({ formId, title, isSystem }: Props) {
  const [pending, startTransition] = useTransition()

  // Built-in forms back live site pages — don't allow casual deletion.
  if (isSystem) return null

  const handleDelete = async () => {
    const confirmed = await openConfirm({
      title: 'Delete form?',
      message: `“${title || 'Untitled form'}” and all its responses will be permanently deleted. This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!confirmed) return
    startTransition(async () => {
      try {
        await deleteFormFromListAction(formId)
        toast.success('Form deleted')
      } catch {
        toast.error('Failed to delete form')
      }
    })
  }

  return (
    <button
      type="button"
      className="admin-btn-ghost admin-btn-ghost--danger"
      onClick={handleDelete}
      disabled={pending}
      aria-label={`Delete ${title || 'form'}`}
    >
      <Icon name="delete" size={15} /> {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
