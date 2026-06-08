'use client'

import { useState, useCallback, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Job } from '@/lib/jobs'
import {
  saveJobAction,
  createNewApplicationFormAction,
  listFormsForPickerAction,
  setJobApplicationFormAction,
  duplicateFormForJobAction,
  type FormPickerOption,
} from '@/app/admin/jobs/actions'
import { slugify } from '@/lib/slugify'
import { toast } from '@/lib/toastStore'
import SaveBar from './SaveBar'

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

  const [saveState,  setSaveState]  = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
  const [savedAt,    setSavedAt]    = useState<Date | null>(null)
  const [errorMsg,   setErrorMsg]   = useState('')
  const [isDirty,    setIsDirty]    = useState(false)
  const [appFormId,  setAppFormId]  = useState<string | null>(job?.application_form_id ?? null)
  const [formOptions, setFormOptions] = useState<FormPickerOption[]>([])
  const [formBusy, setFormBusy] = useState(false)

  // Load the form list for the picker once the job exists.
  useEffect(() => {
    if (!job?.id) return
    listFormsForPickerAction().then(setFormOptions).catch(() => {})
  }, [job?.id])

  const handleSelectForm = (formId: string | null) => {
    if (!job?.id) return
    setAppFormId(formId)
    setFormBusy(true)
    startTransition(async () => {
      const res = await setJobApplicationFormAction(job.id, formId)
      setFormBusy(false)
      if (res.error) toast.error(res.error)
      else toast.success(formId ? 'Form attached to this job' : 'Form detached')
    })
  }

  const handleCreateNewForm = () => {
    if (!job?.id) return
    setFormBusy(true)
    startTransition(async () => {
      const res = await createNewApplicationFormAction(job.id)
      setFormBusy(false)
      if (res.formId) {
        setAppFormId(res.formId)
        const fresh = await listFormsForPickerAction().catch(() => [])
        setFormOptions(fresh)
        toast.success('New application form created')
      } else {
        toast.error(res.error ?? 'Failed to create form')
      }
    })
  }

  const handleDuplicateForm = () => {
    if (!job?.id || !appFormId) return
    setFormBusy(true)
    startTransition(async () => {
      const res = await duplicateFormForJobAction(job.id, appFormId)
      setFormBusy(false)
      if (res.formId) {
        setAppFormId(res.formId)
        const fresh = await listFormsForPickerAction().catch(() => [])
        setFormOptions(fresh)
        toast.success('Duplicated — now editing the job’s own copy')
      } else {
        toast.error(res.error ?? 'Failed to duplicate form')
      }
    })
  }

  const statusRef = useRef(status)
  useEffect(() => { statusRef.current = status }, [status])

  const markDirty = useCallback(() => {
    setIsDirty(true)
    setSaveState('dirty')
  }, [])

  const onTitle = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
    markDirty()
  }

  const save = useCallback(() => {
    startTransition(async () => {
      setSaveState('saving')
      setIsDirty(false)
      const res = await saveJobAction(job?.id ?? null, {
        title, slug, type, location, status: statusRef.current, summary, description,
        what_youll_do: linesToArray(whatYoullDo),
        looking_for: linesToArray(lookingFor),
        nice_to_have: niceToHave,
        why_afterthought: why,
        sort_order: job?.sort_order ?? 0,
      })
      if (res.error) {
        setSaveState('error')
        setErrorMsg(res.error)
      } else {
        setSaveState('saved')
        setSavedAt(new Date())
        if (!job?.id && res.id) router.replace(`/admin/jobs/${res.id}`)
      }
    })
  }, [title, slug, type, location, summary, description, whatYoullDo, lookingFor, niceToHave, why, job, router])

  // Auto-save: debounce 3s for existing jobs
  useEffect(() => {
    if (!isDirty || !job?.id) return
    const timer = setTimeout(() => {
      save()
    }, 3000)
    return () => clearTimeout(timer)
  }, [isDirty, job?.id, save])

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
        <Link href="/admin/jobs" className="admin-editor-back">← Jobs</Link>
        <div className="admin-settings__save">
          <SaveBar
            state={saveState}
            savedAt={savedAt}
            errorMsg={errorMsg}
            onRetry={save}
          />
          <div className="admin-status-toggle" style={{ marginBottom: 0 }}>
            <button type="button" className={`admin-status-toggle__opt ${status === 'open' ? 'is-active' : ''}`} onClick={() => { setStatus('open'); markDirty() }}>Open</button>
            <button type="button" className={`admin-status-toggle__opt ${status === 'closed' ? 'is-active' : ''}`} onClick={() => { setStatus('closed'); markDirty() }}>Closed</button>
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
            <input type="text" value={type} onChange={e => { setType(e.target.value); markDirty() }} placeholder="Full-time" />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input type="text" value={location} onChange={e => { setLocation(e.target.value); markDirty() }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>URL slug</label>
            <input type="text" value={slug} onChange={e => { setSlug(e.target.value); setSlugTouched(true); markDirty() }} placeholder="auto-generated" />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Summary <span style={{ opacity: 0.5 }}>(shown on the careers list card)</span></label>
            <textarea value={summary} onChange={e => { setSummary(e.target.value); markDirty() }} placeholder="One or two sentences." />
          </div>
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Overview</h2>
        <p className="admin-settings-card__hint">Full description. Separate paragraphs with a blank line.</p>
        <div className="admin-field">
          <textarea value={description} onChange={e => { setDescription(e.target.value); markDirty() }} style={{ minHeight: '160px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">What you&apos;ll do</h2>
        <p className="admin-settings-card__hint">One bullet point per line.</p>
        <div className="admin-field">
          <textarea value={whatYoullDo} onChange={e => { setWhatYoullDo(e.target.value); markDirty() }} style={{ minHeight: '140px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">What we&apos;re looking for</h2>
        <p className="admin-settings-card__hint">One bullet point per line.</p>
        <div className="admin-field">
          <textarea value={lookingFor} onChange={e => { setLookingFor(e.target.value); markDirty() }} style={{ minHeight: '140px' }} />
        </div>
      </section>

      <section className="admin-settings-card">
        <div className="admin-settings-grid">
          <div className="admin-field admin-field--wide">
            <label>Nice to have</label>
            <textarea value={niceToHave} onChange={e => { setNiceToHave(e.target.value); markDirty() }} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Why Afterthought</label>
            <textarea value={why} onChange={e => { setWhy(e.target.value); markDirty() }} />
          </div>
        </div>
      </section>

      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Application form</h2>
        <p className="admin-settings-card__hint">
          Choose which form candidates fill in on the public job page. You can reuse one
          form across several roles, or give this role its own. Responses are tagged to
          this job in Responses.
        </p>

        {!job?.id ? (
          <p className="admin-settings-card__hint" style={{ marginTop: 8 }}>
            Save the job first — then you can attach or create its application form.
          </p>
        ) : (
          <>
            <div className="admin-field admin-field--wide" style={{ marginTop: 4, maxWidth: 420 }}>
              <label>Use form</label>
              <select
                value={appFormId ?? ''}
                disabled={formBusy}
                onChange={e => handleSelectForm(e.target.value || null)}
              >
                <option value="">— No form attached —</option>
                {formOptions.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.title}{f.status !== 'published' ? ` (${f.status})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {appFormId && (
                <Link href={`/admin/forms/${appFormId}/edit`} className="admin-btn-primary"
                  style={{ width: 'auto', padding: '10px 18px', textDecoration: 'none' }}>
                  Edit this form →
                </Link>
              )}
              {appFormId && (
                <Link href={`/admin/inbox?form=${appFormId}&job=${job.id}`} className="admin-btn-ghost">
                  View responses
                </Link>
              )}
              <button type="button" className="admin-btn-ghost"
                disabled={formBusy} onClick={handleCreateNewForm}>
                + Create new form
              </button>
              {appFormId && (
                <button type="button" className="admin-btn-ghost"
                  disabled={formBusy} onClick={handleDuplicateForm}
                  title="Make a separate copy just for this role, so edits don’t affect other jobs">
                  Duplicate &amp; customise
                </button>
              )}
            </div>

            {appFormId && formOptions.filter(f => f.id === appFormId).length === 0 && (
              <p className="admin-settings-card__hint" style={{ marginTop: 10 }}>
                Loading form details…
              </p>
            )}
          </>
        )}
      </section>
    </div>
  )
}
