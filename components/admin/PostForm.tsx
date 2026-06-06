'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { savePostAction } from '@/app/admin/posts/actions'
import { slugify } from '@/lib/slugify'

const PostEditor = dynamic(() => import('./PostEditor'), { ssr: false })

interface Props { post: Post | null }

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
  const [saveStatus,  setSaveStatus]  = useState('')

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugTouched) setSlug(slugify(val))
  }

  const save = useCallback((targetStatus: 'draft' | 'published') => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const result = await savePostAction(post?.id ?? null, {
        title, slug, excerpt, content, category,
        cover_image: coverImage || null,
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        og_image: ogImage || null,
        focus_keyword: keyword || null,
        status: targetStatus,
        published_at: targetStatus === 'published' ? (post?.published_at ?? new Date().toISOString()) : null,
      })

      if (result.error) {
        setSaveStatus(`Error: ${result.error}`)
      } else {
        setSaveStatus('Saved')
        if (!post?.id && result.id) {
          router.replace(`/admin/posts/${result.id}`)
        }
        setTimeout(() => setSaveStatus(''), 2500)
      }
    })
  }, [title, slug, excerpt, content, category, coverImage, metaTitle, metaDesc, ogImage, keyword, post, router])

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
        {saveStatus && (
          <span className={`admin-save-pill ${saveStatus.startsWith('Error') ? 'is-error' : ''}`}>
            {saveStatus}
          </span>
        )}
      </div>

      <div className="admin-editor-shell">
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
          <PostEditor content={content} onChange={setContent} />
        </div>

        {/* Sidebar */}
        <div className="admin-editor-sidebar">

          {/* Publish card */}
          <div className="admin-sidebar-card">
            <div className="admin-status-toggle">
              <button
                type="button"
                className={`admin-status-toggle__opt ${status === 'draft' ? 'is-active' : ''}`}
                onClick={() => setStatus('draft')}
              >
                Draft
              </button>
              <button
                type="button"
                className={`admin-status-toggle__opt ${status === 'published' ? 'is-active' : ''}`}
                onClick={() => setStatus('published')}
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
                <select value={category} onChange={e => setCategory(e.target.value)}>
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
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="1–2 sentence summary shown in listings and search."
                />
                <span className={`admin-char-count ${excerpt.length > 200 ? 'is-over' : ''}`}>
                  {excerpt.length} / 200
                </span>
              </div>
              <div className="admin-field">
                <label>Cover image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="admin-field">
                <label>URL slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
                  placeholder="auto-generated-from-title"
                />
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
                    onChange={e => setMetaTitle(e.target.value)}
                    placeholder={title || 'Defaults to post title'}
                  />
                </div>
                <div className="admin-field">
                  <label>Meta description</label>
                  <textarea
                    value={metaDesc}
                    onChange={e => setMetaDesc(e.target.value)}
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
                    onChange={e => setOgImage(e.target.value)}
                    placeholder="Defaults to cover image"
                  />
                </div>
                <div className="admin-field">
                  <label>Focus keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="e.g. brand identity"
                  />
                </div>
              </div>
            </details>
          </div>

        </div>
      </div>
    </div>
  )
}
