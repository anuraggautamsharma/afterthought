'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
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

  const save = useCallback((status: 'draft' | 'published') => {
    startTransition(async () => {
      setSaveStatus('Saving…')
      const result = await savePostAction(post?.id ?? null, {
        title, slug, excerpt, content, category,
        cover_image: coverImage || null,
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        og_image: ogImage || null,
        focus_keyword: keyword || null,
        status,
        published_at: status === 'published' ? (post?.published_at ?? new Date().toISOString()) : null,
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

  return (
    <div>
      {/* Back link */}
      <div style={{ marginBottom: '24px' }}>
        <a href="/admin/posts" className="admin-btn-ghost" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          ← All posts
        </a>
      </div>

      <div className="admin-editor-shell">
        {/* Main content */}
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

        {/* Settings sidebar */}
        <div className="admin-editor-sidebar">
          {/* Publish */}
          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">Publish</span>
            <div className="admin-publish-actions">
              <button type="button" className="admin-btn-primary" disabled={pending}
                onClick={() => save('published')}>
                {post?.status === 'published' ? 'Update published post' : 'Publish →'}
              </button>
              <button type="button" className="admin-btn-secondary" disabled={pending}
                onClick={() => save('draft')}>
                Save as draft
              </button>
            </div>
            {saveStatus && <div className="admin-save-status">{saveStatus}</div>}
            {post?.status === 'published' && post.slug && (
              <a href={`/thinking/${post.slug}`} target="_blank"
                className="admin-save-status" style={{ display: 'block', marginTop: '8px', textDecoration: 'underline', opacity: 0.5 }}>
                View live post ↗
              </a>
            )}
          </div>

          {/* Post settings */}
          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">Settings</span>
            <div className="admin-sidebar-fields">
              <div className="admin-field">
                <label>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Essay</option>
                  <option>Process note</option>
                  <option>Opinion</option>
                  <option>Interview</option>
                </select>
              </div>
              <div className="admin-field">
                <label>URL slug</label>
                <input type="text" value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
                  placeholder="auto-generated-from-title" />
              </div>
              <div className="admin-field">
                <label>Excerpt</label>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
                  placeholder="1–2 sentence summary shown in listings and Google previews." />
              </div>
              <div className="admin-field">
                <label>Cover image URL</label>
                <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://…" />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="admin-sidebar-card">
            <span className="admin-sidebar-card__title">SEO</span>
            <div className="admin-sidebar-fields">
              <div className="admin-field">
                <label>Meta title</label>
                <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                  placeholder={title || 'Defaults to post title'} />
              </div>
              <div className="admin-field">
                <label>Meta description</label>
                <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)}
                  placeholder={excerpt || 'Defaults to excerpt'} />
              </div>
              <div className="admin-field">
                <label>OG image URL</label>
                <input type="url" value={ogImage} onChange={e => setOgImage(e.target.value)}
                  placeholder="Shared on social — defaults to cover image" />
              </div>
              <div className="admin-field">
                <label>Focus keyword</label>
                <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. brand identity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
