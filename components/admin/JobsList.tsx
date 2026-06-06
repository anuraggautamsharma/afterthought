'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Job } from '@/lib/jobs'
import { deleteJobAction, seedJobsAction } from '@/app/admin/jobs/actions'

export default function JobsList({ jobs }: { jobs: Job[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  const open   = jobs.filter(j => j.status === 'open').length
  const closed = jobs.filter(j => j.status === 'closed').length

  const handleImport = () => {
    startTransition(async () => {
      setMsg('Importing…')
      const res = await seedJobsAction()
      setMsg(res.error ? res.error : `Imported ${res.count} roles`)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this job?')) return
    startTransition(() => { deleteJobAction(id) })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Jobs</h1>
          <p className="admin-page-subtitle">{open} open · {closed} closed</p>
        </div>
        <Link href="/admin/jobs/new" className="admin-btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
          + New job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No jobs yet.</div>
            <p>Import your two existing roles from the old site, or write a new one.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="admin-btn-primary" disabled={pending} onClick={handleImport}
                style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
                {pending ? 'Importing…' : 'Import existing roles'}
              </button>
              <Link href="/admin/jobs/new" className="admin-btn-secondary"
                style={{ width: 'auto', display: 'inline-flex', fontSize: '14px', textDecoration: 'none' }}>
                Write a new one
              </Link>
            </div>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {jobs.map(job => (
            <div key={job.id} className="admin-posts-table__row">
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/jobs/${job.id}`} className="admin-post-title-link">
                    {job.title || '(Untitled)'}
                  </Link>
                  <span className={`admin-status-badge admin-status-badge--${job.status === 'open' ? 'published' : 'draft'}`}>
                    <span className="admin-status-badge__dot" />
                    {job.status}
                  </span>
                </div>
                {job.summary && <p className="admin-post-excerpt">{job.summary}</p>}
                <div className="admin-post-meta">
                  <span className="admin-post-category">{job.type}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">{job.location}</span>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/jobs/${job.id}`} className="admin-btn-ghost">Edit</Link>
                {job.status === 'open' && (
                  <Link href={`/careers/${job.slug}`} target="_blank" className="admin-btn-ghost">View ↗</Link>
                )}
                <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
