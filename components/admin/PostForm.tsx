'use client'

import { useState, useCallback, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { savePostAction } from '@/app/admin/posts/actions'
import { slugify } from '@/lib/slugify'
import ImagePicker from './ImagePicker'
import SaveBar from './SaveBar'

const PostEditor = dynamic(() => import('./PostEditor'), { ssr: false })

interface Props { post: Post | null }

function countWords(node: Record<string, unknown>): number {
  if (node.type === 'text') return String(node.text ?? '').split(/\s+/).filter(Boolean).length
  const children = (node.content ?? []) as Record<string, unknown>[]
  return children.reduce((sum, n) => sum + countWords(n), 0)
}

export default function PostForm({ post }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [title,       setTitle]       = useState(post?.title ?? '')
  const [slug,        setSlug]        = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!post?.slug)
  const [excerpt,     setExcerpt]     = useState(post?.excerpt ?? '')
  const [content,     setContent]     = useState<object>(post?.content ?? {})
  const [category,    setCategory]    = useState(post?.category ?? 'Essay')
  const [status,      setStatus]      = useState<'draft' | 'published'>(post?.status ?? 'draft')
  const [coverImage,  setCoverImage]  = useState(post?.cover_image ?? '')
  const [metaTitle,   setMetaTitle]   = useState(post?.meta_title ?? '')
  const [metaDesc,    setMetaDesc]    = useState(post?.meta_description ?? '')
  const [ogImage,     setOgImage]     = useState(post?.og_image ?? '')
  const [keyword,     setKeyword]     = useState(post?.focus_keyword ?? '')
  const [coverFocal,  setCoverFocal]  = useState<'top' | 'center' | 'bottom'>(post?.cover_focal ?? 'center')
  const [faqs,        setFaqs]        = useState<{ q: string; a: string }[]>(post?.faqs ?? [])
  const [pickerOpen,  setPickerOpen]  = useState(false)

  const [saveState,   setSaveState]   = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
  const [savedAt,     setSavedAt]     = useState<Date | null>(null)
  const [errorMsg,    setErrorMsg]    = useState('')
  const [isDirty,     setIsDirty]     = useState(false)

  const statusRef = useRef(status)
  useEffect(() => { statusRef.current = status }, [status])

  const markDirty = useCallback(() => {
    setIsDirty(true)
    setSaveState('dirty')
  }, [])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugTouched) setSlug(slugify(val))
    markDirty()
  }

  const updateFaq = (i: number, key: 'q' | 'a', val: string) => {
    setFaqs(prev => prev.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)))
    markDirty()
  }
  const addFaq = () => { setFaqs(prev => [...prev, { q: '', a: '' }]); markDirty() }
  const removeFaq = (i: number) => { setFaqs(prev => prev.filter((_, idx) => idx !== i)); markDirty() }

  const save = useCallback((targetStatus: 'draft' | 'published') => {
    startTransition(async () => {
      setSaveState('saving')
      setIsDirty(false)
      const result = await savePostAction(post?.id ?? null, {
        title, slug, excerpt, content, category,
        cover_image: coverImage || null,
        cover_focal: coverFocal,
        faqs: faqs.filter(f => f.q.trim() || f.a.trim()),
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        og_image: ogImage || null,
        focus_keyword: keyword || null,
        status: targetStatus,
        published_at: targetStatus === 'published' ? (post?.published_at ?? new Date().toISOString()) : null,
      })

      if (result.error) {
        setSaveState('error')
        setErrorMsg(result.error)
      } else {
        setSaveState('saved')
        setSavedAt(new Date())
        if (!post?.id && result.id) {
          router.replace(`/admin/posts/${result.id}`)
        }
      }
    })
  }, [title, slug, excerpt, content, category, coverImage, coverFocal, faqs, metaTitle, metaDesc, ogImage, keyword, post, router])

  // Auto-save: debounce 3s for existing posts
  useEffect(() => {
    if (!isDirty || !post?.id) return
    const timer = setTimeout(() => {
      save(statusRef.current)
    }, 3000)
    return () => clearTimeout(timer)
  }, [isDirty, post?.id, save])

  // Cmd+S / Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save(statusRef.current)
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

  const wordCount = countWords(content as Record<string, unknown>)
  const readTime = Math.max(1, Math.round(wordCount / 200))

  const saveLabel = pending
    ? 'Saving…'
    : status === 'draft'
      ? 'Save draft'
      : post?.status === 'published'
        ? 'Update'
        : 'Publish →'

  return (
    <div>
      <div className="admin-editor-topbar">
        <Link href="/admin/posts" className="admin-editor-back">← Posts</Link>
        <SaveBar
          state={saveState}
          savedAt={savedAt}
          errorMsg={errorMsg}
          onRetry={() => save(statusRef.current)}
        />
      </div>

      <div className="admin-editor-shell">
        <div className="admin-editor-col">
        {/* Main editor */}
        <div className="admin-editor-main">
          <div className="admin-editor-title-wrap">
            <textarea
              className="admin-editor-title"
              placeholder="Post title…"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              rows={1}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = t.scrollHeight + 'px'
              }}
            />
          </div>
          <div className="admin-editor-divider" />
          <PostEditor content={content} onChange={v => { setContent(v); markDirty() }} />
          <div className="admin-wordcount">
            {wordCount} word{wordCount !== 1 ? 's' : ''} · ~{readTime} min read
          </div>
        </div>

        {/* FAQ editor — its own card; renders an accordion + FAQPage schema on the live post */}
        <div className="admin-faq admin-sidebar-card">
            <div className="admin-faq__head">
              <span className="admin-faq__title">FAQ</span>
              <span className="admin-faq__hint">Shown at the end of the post and surfaced to Google &amp; AI search.</span>
            </div>
            {faqs.map((f, i) => (
              <div key={i} className="admin-faq__row">
                <div className="admin-faq__num">{i + 1}</div>
                <div className="admin-faq__fields">
                  <input
                    type="text"
                    className="admin-faq__q"
                    placeholder="Question"
                    value={f.q}
                    onChange={e => updateFaq(i, 'q', e.target.value)}
                  />
                  <textarea
                    className="admin-faq__a"
                    placeholder="Answer"
                    value={f.a}
                    onChange={e => updateFaq(i, 'a', e.target.value)}
                  />
                </div>
                <button type="button" className="admin-faq__remove" onClick={() => removeFaq(i)} aria-label="Remove question">✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn-secondary admin-faq__add" onClick={addFaq}>
              + Add question
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="admin-editor-sidebar">

          {/* Publish card */}
          <div className="admin-sidebar-card">
            <div className="admin-status-toggle">
              <button
                type="button"
                className={`admin-status-toggle__opt ${status === 'draft' ? 'is-active' : ''}`}
                onClick={() => { setStatus('draft'); markDirty() }}
              >
                Draft
              </button>
              <button
                type="button"
                className={`admin-status-toggle__opt ${status === 'published' ? 'is-active' : ''}`}
                onClick={() => { setStatus('published'); markDirty() }}
              >
                Published
              </button>
            </div>
            <button
              type="button"
              className="admin-btn-primary"
              disabled={pending}
              onClick={() => save(status)}
            >
              {saveLabel}
            </button>
            {post?.status === 'published' && post.slug && (
              <a href={`/thinking/${post.slug}`} target="_blank" className="admin-view-live">
                View live post ↗
              </a>
            )}
          </div>

          {/* Settings card */}
          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">Settings</span>
            <div className="admin-sidebar-fields">
              <div className="admin-field">
                <label>Category</label>
                <select value={category} onChange={e => { setCategory(e.target.value); markDirty() }}>
                  <option>Essay</option>
                  <option>Process note</option>
                  <option>Opinion</option>
                  <option>Studio</option>
                  <option>Interview</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={e => { setExcerpt(e.target.value); markDirty() }}
                  placeholder="1–2 sentence summary shown in listings and search."
                />
                <span className={`admin-char-count ${excerpt.length > 200 ? 'is-over' : ''}`}>
                  {excerpt.length} / 200
                </span>
              </div>
              <div className="admin-field">
                <label>Cover image</label>
                {coverImage && (
                  <div className="admin-cover-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt="Cover" />
                    <button type="button" className="admin-cover-remove" onClick={() => { setCoverImage(''); markDirty() }}>✕</button>
                  </div>
                )}
                <div className="admin-cover-actions">
                  <button type="button" className="admin-btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setPickerOpen(true)}>
                    {coverImage ? 'Change image' : 'Choose from media'}
                  </button>
                </div>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => { setCoverImage(e.target.value); markDirty() }}
                  placeholder="or paste URL…"
                  style={{ marginTop: '6px' }}
                />
                {coverImage && (
                  <div style={{ marginTop: '10px' }}>
                    <label>Focal point</label>
                    <select value={coverFocal} onChange={e => { setCoverFocal(e.target.value as 'top' | 'center' | 'bottom'); markDirty() }}>
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                    <span className="admin-field__hint">Which part of the image to keep when it&apos;s cropped.</span>
                  </div>
                )}
              </div>
              <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={url => { setCoverImage(url); setPickerOpen(false); markDirty() }} />
              <div className="admin-field">
                <label>URL slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugTouched(true); markDirty() }}
                  placeholder="auto-generated-from-title"
                />
                <span className="admin-field__hint">Auto-generated from title. Edit to lock it.</span>
              </div>
            </div>
          </div>

          {/* SEO card — collapsed by default */}
          <div className="admin-sidebar-card admin-sidebar-card--flush">
            <details>
              <summary className="admin-sidebar-card__title admin-sidebar-card__summary">
                SEO
              </summary>
              <div className="admin-sidebar-fields admin-sidebar-seo-fields">
                <div className="admin-field">
                  <label>Meta title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={e => { setMetaTitle(e.target.value); markDirty() }}
                    placeholder={title || 'Defaults to post title'}
                  />
                </div>
                <div className="admin-field">
                  <label>Meta description</label>
                  <textarea
                    value={metaDesc}
                    onChange={e => { setMetaDesc(e.target.value); markDirty() }}
                    placeholder={excerpt || 'Defaults to excerpt'}
                  />
                  <span className={`admin-char-count ${metaDesc.length > 160 ? 'is-over' : ''}`}>
                    {metaDesc.length} / 160
                  </span>
                </div>
                <div className="admin-field">
                  <label>OG image URL</label>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={e => { setOgImage(e.target.value); markDirty() }}
                    placeholder="Defaults to cover image"
                  />
                  <span className="admin-field__hint">Overrides the cover image for social media shares.</span>
                </div>
                <div className="admin-field">
                  <label>Focus keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => { setKeyword(e.target.value); markDirty() }}
                    placeholder="e.g. brand identity"
                  />
                  <span className="admin-field__hint">The main phrase this post should rank for in Google.</span>
                </div>
              </div>
            </details>
          </div>

        </div>
      </div>
    </div>
  )
}
