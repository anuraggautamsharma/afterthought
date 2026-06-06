'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { saveProjectAction } from '@/app/admin/work/actions'
import { slugify } from '@/lib/slugify'
import ImagePicker from './ImagePicker'

const PostEditor = dynamic(() => import('./PostEditor'), { ssr: false })

export default function ProjectForm({ project }: { project: Project | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [title,       setTitle]       = useState(project?.title ?? '')
  const [slug,        setSlug]        = useState(project?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!project?.slug)
  const [client,      setClient]      = useState(project?.client ?? '')
  const [scope,       setScope]       = useState(project?.scope ?? '')
  const [year,        setYear]        = useState(project?.year ?? new Date().getFullYear().toString())
  const [creditLabel, setCreditLabel] = useState(project?.credit_label ?? 'Studio')
  const [creditValue, setCreditValue] = useState(project?.credit_value ?? 'Afterthought')
  const [caseLabel,   setCaseLabel]   = useState(project?.case_label ?? '')
  const [heroColor,   setHeroColor]   = useState(project?.hero_color ?? '#161A3B')
  const [coverImage,  setCoverImage]  = useState(project?.cover_image ?? '')
  const [summary,     setSummary]     = useState(project?.summary ?? '')
  const [content,     setContent]     = useState<object>(project?.content ?? {})
  const [status,      setStatus]      = useState<'draft' | 'published'>(project?.status ?? 'draft')
  const [metaTitle,   setMetaTitle]   = useState(project?.meta_title ?? '')
  const [metaDesc,    setMetaDesc]    = useState(project?.meta_description ?? '')
  const [ogImage,     setOgImage]     = useState(project?.og_image ?? '')
  const [saveStatus,  setSaveStatus]  = useState('')
  const [coverPicker, setCoverPicker] = useState(false)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugTouched) setSlug(slugify(val.replace(/\*/g, '')))
  }

  const save = useCallback((targetStatus: 'draft' | 'published') => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const result = await saveProjectAction(project?.id ?? null, {
        title, slug, client, scope, year,
        credit_label: creditLabel, credit_value: creditValue,
        case_label: caseLabel, hero_color: heroColor,
        cover_image: coverImage || null,
        summary, content, status: targetStatus,
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        og_image: ogImage || null,
        sort_order: project?.sort_order ?? 0,
      })
      if (result.error) setSaveStatus(`Error: ${result.error}`)
      else {
        setSaveStatus('Saved')
        if (!project?.id && result.id) router.replace(`/admin/work/${result.id}`)
        setTimeout(() => setSaveStatus(''), 2500)
      }
    })
  }, [title, slug, client, scope, year, creditLabel, creditValue, caseLabel, heroColor, coverImage, summary, content, metaTitle, metaDesc, ogImage, project, router])

  const saveLabel = pending ? 'Saving…' : status === 'draft' ? 'Save draft' : project?.status === 'published' ? 'Update' : 'Publish →'

  return (
    <div>
      <div className="admin-editor-topbar">
        <Link href="/admin/work" className="admin-editor-back">← Work</Link>
        {saveStatus && (
          <span className={`admin-save-pill ${saveStatus.startsWith('Error') ? 'is-error' : ''}`}>{saveStatus}</span>
        )}
      </div>

      <div className="admin-editor-shell">
        <div className="admin-editor-main">
          <div className="admin-editor-title-wrap">
            <textarea
              className="admin-editor-title"
              placeholder="Project title… (wrap a phrase in *asterisks* for italic emphasis)"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              rows={1}
              onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }}
            />
          </div>
          <div className="admin-editor-divider" />
          <PostEditor content={content} onChange={setContent} />
        </div>

        <div className="admin-editor-sidebar">
          <div className="admin-sidebar-card">
            <div className="admin-status-toggle">
              <button type="button" className={`admin-status-toggle__opt ${status === 'draft' ? 'is-active' : ''}`} onClick={() => setStatus('draft')}>Draft</button>
              <button type="button" className={`admin-status-toggle__opt ${status === 'published' ? 'is-active' : ''}`} onClick={() => setStatus('published')}>Published</button>
            </div>
            <button type="button" className="admin-btn-primary" disabled={pending} onClick={() => save(status)}>{saveLabel}</button>
            {project?.status === 'published' && project.slug && (
              <a href={`/work/${project.slug}`} target="_blank" className="admin-view-live">View live project ↗</a>
            )}
          </div>

          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">Case study details</span>
            <div className="admin-sidebar-fields">
              <div className="admin-field"><label>Client</label><input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Justach Salon & Spa" /></div>
              <div className="admin-field"><label>Scope</label><input type="text" value={scope} onChange={e => setScope(e.target.value)} placeholder="e.g. Naming · Logo · Identity" /></div>
              <div className="admin-field"><label>Year</label><input type="text" value={year} onChange={e => setYear(e.target.value)} /></div>
              <div className="admin-field"><label>Case label</label><input type="text" value={caseLabel} onChange={e => setCaseLabel(e.target.value)} placeholder="e.g. Case 001" /></div>
              <div className="admin-field"><label>Credit label</label><input type="text" value={creditLabel} onChange={e => setCreditLabel(e.target.value)} placeholder="Studio / Lead" /></div>
              <div className="admin-field"><label>Credit value</label><input type="text" value={creditValue} onChange={e => setCreditValue(e.target.value)} placeholder="Afterthought" /></div>
              <div className="admin-field">
                <label>Summary <span style={{ opacity: 0.5 }}>(shown on the Work grid)</span></label>
                <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="One short line." />
              </div>
              <div className="admin-field"><label>URL slug</label><input type="text" value={slug} onChange={e => { setSlug(e.target.value); setSlugTouched(true) }} placeholder="auto-generated" /></div>
            </div>
          </div>

          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">Hero</span>
            <div className="admin-sidebar-fields">
              <div className="admin-field">
                <label>Cover image <span style={{ opacity: 0.5 }}>(hero + grid tile)</span></label>
                {coverImage && (
                  <div className="admin-cover-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt="Cover" />
                    <button type="button" className="admin-cover-remove" onClick={() => setCoverImage('')}>✕</button>
                  </div>
                )}
                <div className="admin-cover-actions">
                  <button type="button" className="admin-btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setCoverPicker(true)}>
                    {coverImage ? 'Change image' : 'Choose from media'}
                  </button>
                </div>
              </div>
              <div className="admin-field">
                <label>Hero colour <span style={{ opacity: 0.5 }}>(used when no cover image)</span></label>
                <input type="text" value={heroColor} onChange={e => setHeroColor(e.target.value)} placeholder="#161A3B or var(--c-block-lime)" />
              </div>
            </div>
          </div>

          <div className="admin-sidebar-card admin-sidebar-card--flush">
            <details>
              <summary className="admin-sidebar-card__title admin-sidebar-card__summary">SEO</summary>
              <div className="admin-sidebar-fields admin-sidebar-seo-fields">
                <div className="admin-field"><label>Meta title</label><input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Defaults to project title" /></div>
                <div className="admin-field"><label>Meta description</label><textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Defaults to summary" /></div>
                <div className="admin-field"><label>OG image URL</label><input type="url" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="Defaults to cover image" /></div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <ImagePicker open={coverPicker} onClose={() => setCoverPicker(false)} onSelect={url => { setCoverImage(url); setCoverPicker(false) }} />
    </div>
  )
}
