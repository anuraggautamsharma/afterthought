'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { TeamMember } from '@/lib/team'
import { saveTeamAction } from '@/app/admin/team/actions'
import ImagePicker from './ImagePicker'
import SaveBar from './SaveBar'

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
  const [picker,      setPicker]      = useState(false)

  const [saveState,  setSaveState]  = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
  const [savedAt,    setSavedAt]    = useState<Date | null>(null)
  const [errorMsg,   setErrorMsg]   = useState('')
  const [isDirty,    setIsDirty]    = useState(false)

  const markDirty = useCallback(() => {
    setIsDirty(true)
    setSaveState('dirty')
  }, [])

  const save = useCallback(() => {
    startTransition(async () => {
      setSaveState('saving')
      setIsDirty(false)
      const res = await saveTeamAction(member?.id ?? null, {
        name, role, initials, bio,
        photo: photo || null,
        accent_color: accentColor,
        email, arena_url: arena, linkedin_url: linkedin,
        sort_order: member?.sort_order ?? 0,
      })
      if (res.error) {
        setSaveState('error')
        setErrorMsg(res.error)
      } else {
        setSaveState('saved')
        setSavedAt(new Date())
        if (!member?.id && res.id) router.replace(`/admin/team/${res.id}`)
      }
    })
  }, [name, role, initials, bio, photo, accentColor, email, arena, linkedin, member, router])

  // Auto-save: debounce 3s for existing members
  useEffect(() => {
    if (!isDirty || !member?.id) return
    const timer = setTimeout(() => save(), 3000)
    return () => clearTimeout(timer)
  }, [isDirty, member?.id, save])

  // Cmd+S / Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [save])

  // beforeunload warning
  useEffect(() => {
    if (saveState !== 'dirty') return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveState])

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href="/admin/team" className="admin-editor-back">← Team</Link>
        <div className="admin-settings__save">
          <SaveBar state={saveState} savedAt={savedAt} errorMsg={errorMsg} onRetry={save} />
          <button className="admin-btn-primary" disabled={pending} onClick={save} style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : member ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field"><label>Name</label><input type="text" value={name} onChange={e => { setName(e.target.value); markDirty() }} /></div>
          <div className="admin-field"><label>Role</label><input type="text" value={role} onChange={e => { setRole(e.target.value); markDirty() }} placeholder="Co-founder · Design lead" /></div>
          <div className="admin-field"><label>Initials <span style={{ opacity: 0.5 }}>(fallback when no photo)</span></label><input type="text" value={initials} onChange={e => { setInitials(e.target.value); markDirty() }} placeholder="AG" /></div>
          <div className="admin-field"><label>Accent colour</label><input type="text" value={accentColor} onChange={e => { setAccentColor(e.target.value); markDirty() }} placeholder="#CDBAF2" /></div>
          <div className="admin-field admin-field--wide">
            <label>Photo <span style={{ opacity: 0.5 }}>(optional — replaces initials)</span></label>
            {photo && (
              <div className="admin-cover-preview" style={{ aspectRatio: '1/1', maxWidth: '160px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Portrait" />
                <button type="button" className="admin-cover-remove" onClick={() => { setPhoto(''); markDirty() }}>✕</button>
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
            <textarea value={bio} onChange={e => { setBio(e.target.value); markDirty() }} style={{ minHeight: '150px' }} />
          </div>
          <div className="admin-field"><label>Email</label><input type="email" value={email} onChange={e => { setEmail(e.target.value); markDirty() }} /></div>
          <div className="admin-field"><label>Are.na URL</label><input type="url" value={arena} onChange={e => { setArena(e.target.value); markDirty() }} placeholder="https://are.na/…" /></div>
          <div className="admin-field"><label>LinkedIn URL</label><input type="url" value={linkedin} onChange={e => { setLinkedin(e.target.value); markDirty() }} placeholder="https://linkedin.com/in/…" /></div>
        </div>
      </section>

      <ImagePicker open={picker} onClose={() => setPicker(false)} onSelect={url => { setPhoto(url); setPicker(false); markDirty() }} />
    </div>
  )
}
