'use client'

import { useState, useTransition } from 'react'
import { ensureSystemFormsAction } from '@/app/admin/forms/actions'
import { toast } from '@/lib/toastStore'

export default function SystemFormsSetup({ missing }: { missing: string[] }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  if (done || missing.length === 0) return null

  const handleSetup = () => {
    startTransition(async () => {
      try {
        const res = await ensureSystemFormsAction()
        if (res.created.length > 0) {
          toast.success(`Created ${res.created.join(' & ')}`)
        } else {
          toast.success('Built-in forms already set up')
        }
        setDone(true)
      } catch (e) {
        toast.error('Setup failed — did you run the migration?')
      }
    })
  }

  return (
    <div className="admin-setup-banner">
      <div className="admin-setup-banner__text">
        <strong>Set up your built-in forms</strong>
        <span>
          Creates the {missing.join(' & ')} form{missing.length !== 1 ? 's' : ''} that power
          your site’s pages. You can edit {missing.length !== 1 ? 'them' : 'it'} like any other form.
        </span>
      </div>
      <button
        type="button"
        className="admin-btn-primary admin-btn-primary--sm"
        onClick={handleSetup}
        disabled={pending}
      >
        {pending ? 'Setting up…' : 'Set up now'}
      </button>
    </div>
  )
}
