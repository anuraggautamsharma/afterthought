'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { deleteServiceAction, seedServicesAction, reorderServiceAction } from '@/app/admin/services/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'

export default function ServicesList({ services }: { services: Service[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  const handleImport = () => {
    startTransition(async () => {
      setMsg('Importing…')
      const res = await seedServicesAction()
      setMsg(res.error ? res.error : `Imported ${res.count} services`)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const confirmed = await openConfirm({
        title: 'Delete service?',
        message: 'This cannot be undone.',
        confirmLabel: 'Delete',
        danger: true,
      })
      if (!confirmed) return
      await deleteServiceAction(id)
    })
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    startTransition(async () => {
      try {
        await reorderServiceAction(id, direction)
      } catch {
        toast.error('Failed to reorder')
      }
    })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-subtitle">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/services/new" className="admin-btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
          + New service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No services yet.</div>
            <p>Import your seven existing services with all the copy pre-filled.</p>
            <button className="admin-btn-primary" disabled={pending} onClick={handleImport}
              style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
              {pending ? 'Importing…' : 'Import existing services'}
            </button>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {services.map((svc, idx) => (
            <div key={svc.id} className="admin-posts-table__row">
              <div className="admin-reorder-col">
                <button
                  className="admin-reorder-btn"
                  disabled={idx === 0 || pending}
                  onClick={() => handleReorder(svc.id, 'up')}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  className="admin-reorder-btn"
                  disabled={idx === services.length - 1 || pending}
                  onClick={() => handleReorder(svc.id, 'down')}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/services/${svc.id}`} className="admin-post-title-link">
                    <span style={{ opacity: 0.4, fontFamily: 'var(--font-mono)', fontSize: '13px', marginRight: '8px' }}>{svc.num}</span>
                    {svc.title || '(Untitled)'}
                  </Link>
                </div>
                {svc.description && <p className="admin-post-excerpt">{svc.description}</p>}
                <div className="admin-post-meta">
                  <span className="admin-post-category">{svc.tags?.join(' · ')}</span>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/services/${svc.id}`} className="admin-btn-ghost">Edit</Link>
                <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(svc.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
