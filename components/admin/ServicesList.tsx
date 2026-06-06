'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { deleteServiceAction, seedServicesAction } from '@/app/admin/services/actions'

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
    if (!confirm('Delete this service?')) return
    startTransition(() => { deleteServiceAction(id) })
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
          {services.map(svc => (
            <div key={svc.id} className="admin-posts-table__row">
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
