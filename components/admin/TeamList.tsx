'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { TeamMember } from '@/lib/team'
import { deleteTeamAction, seedTeamAction } from '@/app/admin/team/actions'

export default function TeamList({ team }: { team: TeamMember[] }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  const handleImport = () => {
    startTransition(async () => {
      setMsg('Importing…')
      const res = await seedTeamAction()
      setMsg(res.error ? res.error : `Imported ${res.count} members`)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this team member?')) return
    startTransition(() => { deleteTeamAction(id) })
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Team</h1>
          <p className="admin-page-subtitle">{team.length} member{team.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/team/new" className="admin-btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
          + New member
        </Link>
      </div>

      {team.length === 0 ? (
        <div className="admin-posts-table">
          <div className="admin-empty">
            <div className="admin-empty__title">No team members yet.</div>
            <p>Import the two founders with bios pre-filled — then add photos and social links.</p>
            <button className="admin-btn-primary" disabled={pending} onClick={handleImport}
              style={{ width: 'auto', display: 'inline-flex', fontSize: '14px' }}>
              {pending ? 'Importing…' : 'Import founders'}
            </button>
            {msg && <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{msg}</p>}
          </div>
        </div>
      ) : (
        <div className="admin-posts-table">
          {team.map(m => (
            <div key={m.id} className="admin-posts-table__row">
              <div className="admin-post-content">
                <div className="admin-post-title-row">
                  <Link href={`/admin/team/${m.id}`} className="admin-post-title-link">{m.name || '(Unnamed)'}</Link>
                </div>
                <div className="admin-post-meta">
                  <span className="admin-post-category">{m.role}</span>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/team/${m.id}`} className="admin-btn-ghost">Edit</Link>
                <button className="admin-btn-ghost admin-btn-ghost--danger" onClick={() => handleDelete(m.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
