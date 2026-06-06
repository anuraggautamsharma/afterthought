'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Job } from '@/lib/jobs'
import { saveJobAction } from '@/app/admin/jobs/actions'
import { slugify } from '@/lib/slugify'

const linesToArray = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean)
const arrayToLines = (a: string[] | undefined) => (a ?? []).join('\n')

export default function JobForm({ job }: { job: Job | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [title,       setTitle]       = useState(job?.title ?? '')
  const [slug,        setSlug]        = useState(job?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!job?.slug)
  const [type,        setType]        = useState(job?.type ?? 'Full-time')
  const [location,    setLocation]    = useState(job?.location ?? 'Bangalore · Remote considered')
  const [status,      setStatus]      = useState<'open' | 'closed'>(job?.status ?? 'open')
  const [summary,     setSummary]     = useState(job?.summary ?? '')
  const [description, setDescription] = useState(job?.description ?? '')
  const [whatYoullDo, setWhatYoullDo] = useState(arrayToLines(job?.what_youll_do))
  const [lookingFor,  setLookingFor]  = useState(arrayToLines(job?.looking_for))
  const [niceToHave,  setNiceToHave]  = useState(job?.nice_to_have ?? '')
  const [why,         setWhy]         = useState(job?.why_afterthought ?? '')
  const [saveStatus,  setSaveStatus]  = useState('')

  const onTitle = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const save = () => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const res = await saveJobAction(job?.id ?? null, {
        title, slug, type, location, status, summary, description,
        what_youll_do: linesToArray(whatYoullDo),
        looking_for: linesToArray(lookingFor),
        nice_to_have: niceToHave,
        why_afterthought: why,
        sort_order: job?.sort_order ?? 0,
      })
      if (res.error) setSaveStatus(`Error: ${res.error}`)
      else {
        setSaveStatus('Saved')
        if (!job?.id && res.id) router.replace(`/admin/jobs/${res.id}`)
        setTimeout(() => setSaveStatus(''), 2500)
      }
    })
  }

  return (
    <div className="admin-jobform">
      <div className="admin-editor-topbar">
        <Link href="/admin/jobs" className="admin-editor-back">← Jobs</Link>
        <div className="admin-settings__save">
          {saveStatus && (
            <span className={`admin-save-pill ${saveStatus.startsWith('Error') ? 'is-error' : ''}`}>{saveStatus}</span>
          )}
          <div className="admin-status-toggle" style={{ marginBottom: 0 }}>
            <button type="button" className={`admin-status-toggle__opt ${status === 'open' ? 'is-active' : ''}`} onClick={() => setStatus('open')}>Open</button>
            <button type="button" className={`admin-status-toggle__opt ${status === 'closed' ? 'is-active' : ''}`} onClick={() => setStatus('closed')}>Closed</button>
          </div>
          <button className="admin-btn-primary" disabled={pending} onClick={save}
            style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : job ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field admin-field--wide">
            <label>Job title</label>
            <input type="text" value={title} onChange={e => onTitle(e.target.value)} placeholder="e.g. Motion Graphic Designer" />
          </div>
          <div className="admin-field">
            <label>Type</label>
            <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="Full-time" />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>URL slug</label>
            <input type="text" value={slug} onChange={e => { setSlug(e.target.value); setSlugTouched(true) }} placeholder="auto-generated" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Summary <span style={{ opacity: 0.5 }}>(shown on the careers list card)</span></label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="One or two sentences." />
          </div>
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Overview</h2>
        <p className="admin-settings-card__hint">Full description. Separate paragraphs with a blank line.</p>
        <div className="admin-field">
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: '160px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">What you&apos;ll do</h2>
        <p className="admin-settings-card__hint">One bullet point per line.</p>
        <div className="admin-field">
          <textarea value={whatYoullDo} onChange={e => setWhatYoullDo(e.target.value)} style={{ minHeight: '140px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">What we&apos;re looking for</h2>
        <p className="admin-settings-card__hint">One bullet point per line.</p>
        <div className="admin-field">
          <textarea value={lookingFor} onChange={e => setLookingFor(e.target.value)} style={{ minHeight: '140px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field admin-field--wide">
            <label>Nice to have</label>
            <textarea value={niceToHave} onChange={e => setNiceToHave(e.target.value)} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Why Afterthought</label>
            <textarea value={why} onChange={e => setWhy(e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  )
}
