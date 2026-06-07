'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { saveServiceAction } from '@/app/admin/services/actions'
import SaveBar from './SaveBar'

const linesToArray = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean)
const arrayToLines = (a: string[] | undefined) => (a ?? []).join('\n')
const commaToArray = (s: string) => s.split(',').map(l => l.trim()).filter(Boolean)

const COLORS = ['lime', 'cream', 'sky', 'coral', 'mint', 'lilac', 'pink', 'navy']

export default function ServiceForm({ service }: { service: Service | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [num,          setNum]          = useState(service?.num ?? '')
  const [color,        setColor]        = useState(service?.color ?? 'lime')
  const [title,        setTitle]        = useState(service?.title ?? '')
  const [tags,         setTags]         = useState((service?.tags ?? []).join(', '))
  const [description,  setDescription]  = useState(service?.description ?? '')
  const [deliverables, setDeliverables] = useState(arrayToLines(service?.deliverables))
  const [whoFor,       setWhoFor]       = useState(service?.who_for ?? '')

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
      const res = await saveServiceAction(service?.id ?? null, {
        num, color, title,
        tags: commaToArray(tags),
        description,
        deliverables: linesToArray(deliverables),
        who_for: whoFor,
        sort_order: service?.sort_order ?? 0,
      })
      if (res.error) {
        setSaveState('error')
        setErrorMsg(res.error)
      } else {
        setSaveState('saved')
        setSavedAt(new Date())
        if (!service?.id && res.id) router.replace(`/admin/services/${res.id}`)
      }
    })
  }, [num, color, title, tags, description, deliverables, whoFor, service, router])

  // Auto-save: debounce 3s for existing services
  useEffect(() => {
    if (!isDirty || !service?.id) return
    const timer = setTimeout(() => save(), 3000)
    return () => clearTimeout(timer)
  }, [isDirty, service?.id, save])

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
        <Link href="/admin/services" className="admin-editor-back">← Services</Link>
        <div className="admin-settings__save">
          <SaveBar state={saveState} savedAt={savedAt} errorMsg={errorMsg} onRetry={save} />
          <button className="admin-btn-primary" disabled={pending} onClick={save} style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : service ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field">
            <label>Number</label>
            <input type="text" value={num} onChange={e => { setNum(e.target.value); markDirty() }} placeholder="01" />
          </div>
          <div className="admin-field">
            <label>Colour</label>
            <select value={color} onChange={e => { setColor(e.target.value); markDirty() }}>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field admin-field--wide">
            <label>Title</label>
            <input type="text" value={title} onChange={e => { setTitle(e.target.value); markDirty() }} placeholder="e.g. Brand Identity & Strategy" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Tags <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
            <input type="text" value={tags} onChange={e => { setTags(e.target.value); markDirty() }} placeholder="Visual, Verbal, Systems" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Description</label>
            <textarea value={description} onChange={e => { setDescription(e.target.value); markDirty() }} style={{ minHeight: '110px' }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>What we deliver <span style={{ opacity: 0.5 }}>(one per line)</span></label>
            <textarea value={deliverables} onChange={e => { setDeliverables(e.target.value); markDirty() }} style={{ minHeight: '130px' }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Who it&apos;s for</label>
            <textarea value={whoFor} onChange={e => { setWhoFor(e.target.value); markDirty() }} />
          </div>
        </div>
      </section>
    </div>
  )
}
