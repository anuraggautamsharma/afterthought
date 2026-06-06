'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { saveServiceAction } from '@/app/admin/services/actions'

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
  const [saveStatus,   setSaveStatus]   = useState('')

  const save = () => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const res = await saveServiceAction(service?.id ?? null, {
        num, color, title,
        tags: commaToArray(tags),
        description,
        deliverables: linesToArray(deliverables),
        who_for: whoFor,
        sort_order: service?.sort_order ?? 0,
      })
      if (res.error) setSaveStatus(`Error: ${res.error}`)
      else {
        setSaveStatus('Saved')
        if (!service?.id && res.id) router.replace(`/admin/services/${res.id}`)
        setTimeout(() => setSaveStatus(''), 2500)
      }
    })
  }

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href="/admin/services" className="admin-editor-back">← Services</Link>
        <div className="admin-settings__save">
          {saveStatus && <span className={`admin-save-pill ${saveStatus.startsWith('Error') ? 'is-error' : ''}`}>{saveStatus}</span>}
          <button className="admin-btn-primary" disabled={pending} onClick={save} style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : service ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field">
            <label>Number</label>
            <input type="text" value={num} onChange={e => setNum(e.target.value)} placeholder="01" />
          </div>
          <div className="admin-field">
            <label>Colour</label>
            <select value={color} onChange={e => setColor(e.target.value)}>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field admin-field--wide">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Brand Identity & Strategy" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Tags <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Visual, Verbal, Systems" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: '110px' }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>What we deliver <span style={{ opacity: 0.5 }}>(one per line)</span></label>
            <textarea value={deliverables} onChange={e => setDeliverables(e.target.value)} style={{ minHeight: '130px' }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Who it&apos;s for</label>
            <textarea value={whoFor} onChange={e => setWhoFor(e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  )
}
