'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { stripEmphasis } from '@/lib/projects'
import { deleteProjectAction, seedProjectsAction } from '@/app/admin/work/actions'
import { openConfirm } from '@/lib/confirmStore'

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  const published = projects.filter(p => p.status === 'published').length
  const drafts    = projects.filter(p => p.status === 'draft').length

  const handleImport = () => {
    startTransition(async () => {
      setMsg('Importing…')
      const res = await seedProjectsAction()
      setMsg(res.error ? res.error : `Imported ${res.count} case studies as drafts`)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const confirmed = await openConfirm({
        title: 'Delete this project?',
        message: 'This cannot be undone.',
        confirmLabel: 'Delete',
        danger: true,
      })
      if (!confirmed) return
      await deleteProjectAction(id)
    })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Work</h1>
          <p className="admin-page-subtitle">{published} published · {drafts} draft{drafts !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/work/new" className="admin-btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No projects yet.</div>
            <p>Import your four existing case studies as drafts — all the copy is pre-filled, you just add the images and publish.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="admin-btn-primary" disabled={pending} onClick={handleImport}
                style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
                {pending ? 'Importing…' : 'Import existing case studies'}
              </button>
              <Link href="/admin/work/new" className="admin-btn-secondary"
                style={{ width: 'auto', display: 'inline-flex', fontSize: '14px', textDecoration: 'none' }}>
                Start a new one
              </Link>
            </div>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {projects.map(project => (
            <div key={project.id} className="admin-posts-table__row">
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/work/${project.id}`} className="admin-post-title-link">
                    {stripEmphasis(project.title) || '(Untitled)'}
                  </Link>
                  <span className={`admin-status-badge admin-status-badge--${project.status}`}>
                    <span className="admin-status-badge__dot" />
                    {project.status}
                  </span>
                </div>
                {project.summary && <p className="admin-post-excerpt">{project.summary}</p>}
                <div className="admin-post-meta">
                  <span className="admin-post-category">{project.client}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">{project.scope}</span>
                  <span className="admin-post-meta__sep" />
                  <span className="admin-date">{project.year}</span>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/work/${project.id}`} className="admin-btn-ghost">Edit</Link>
                {project.status === 'published' && (
                  <Link href={`/work/${project.slug}`} target="_blank" className="admin-btn-ghost">View ↗</Link>
                )}
                <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(project.id)}>
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
