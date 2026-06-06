'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { TeamMember } from '@/lib/team'
import { saveTeamAction } from '@/app/admin/team/actions'
import ImagePicker from './ImagePicker'

export default function TeamForm({ member }: { member: TeamMember | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [name,        setName]        = useState(member?.name ?? '')
  const [role,        setRole]        = useState(member?.role ?? '')
  const [initials,    setInitials]    = useState(member?.initials ?? '')
  const [bio,         setBio]         = useState(member?.bio ?? '')
  const [photo,       setPhoto]       = useState(member?.photo ?? '')
  const [accentColor, setAccentColor] = useState(member?.accent_color ?? '#CDBAF2')
  const [email,       setEmail]       = useState(member?.email ?? '')
  const [arena,       setArena]       = useState(member?.arena_url ?? '')
  const [linkedin,    setLinkedin]    = useState(member?.linkedin_url ?? '')
  const [saveStatus,  setSaveStatus]  = useState('')
  const [picker,      setPicker]      = useState(false)

  const save = () => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const res = await saveTeamAction(member?.id ?? null, {
        name, role, initials, bio,
        photo: photo || null,
        accent_color: accentColor,
        email, arena_url: arena, linkedin_url: linkedin,
        sort_order: member?.sort_order ?? 0,
      })
      if (res.error) setSaveStatus(`Error: ${res.error}`)
      else {
        setSaveStatus('Saved')
        if (!member?.id && res.id) router.replace(`/admin/team/${res.id}`)
        setTimeout(() => setSaveStatus(''), 2500)
      }
    })
  }

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href="/admin/team" className="admin-editor-back">← Team</Link>
        <div className="admin-settings__save">
          {saveStatus && <span className={`admin-save-pill ${saveStatus.startsWith('Error') ? 'is-error' : ''}`}>{saveStatus}</span>}
          <button className="admin-btn-primary" disabled={pending} onClick={save} style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : member ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field"><label>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="admin-field"><label>Role</label><input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Co-founder · Design lead" /></div>
          <div className="admin-field"><label>Initials <span style={{ opacity: 0.5 }}>(fallback when no photo)</span></label><input type="text" value={initials} onChange={e => setInitials(e.target.value)} placeholder="AG" /></div>
          <div className="admin-field"><label>Accent colour</label><input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)} placeholder="#CDBAF2" /></div>
          <div className="admin-field admin-field--wide">
            <label>Photo <span style={{ opacity: 0.5 }}>(optional — replaces initials)</span></label>
            {photo && (
              <div className="admin-cover-preview" style={{ aspectRatio: '1/1', maxWidth: '160px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Portrait" />
                <button type="button" className="admin-cover-remove" onClick={() => setPhoto('')}>✕</button>
              </div>
            )}
            <div className="admin-cover-actions">
              <button type="button" className="admin-btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setPicker(true)}>
                {photo ? 'Change photo' : 'Choose from media'}
              </button>
            </div>
          </div>
          <div className="admin-field admin-field--wide">
            <label>Bio <span style={{ opacity: 0.5 }}>(separate paragraphs with a blank line)</span></label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ minHeight: '150px' }} />
          </div>
          <div className="admin-field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="admin-field"><label>Are.na URL</label><input type="url" value={arena} onChange={e => setArena(e.target.value)} placeholder="https://are.na/…" /></div>
          <div className="admin-field"><label>LinkedIn URL</label><input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" /></div>
        </div>
      </section>

      <ImagePicker open={picker} onClose={() => setPicker(false)} onSelect={url => { setPhoto(url); setPicker(false) }} />
    </div>
  )
}
