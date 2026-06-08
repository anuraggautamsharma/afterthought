'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/Icon'
import { subscribeCommand, commandPalette } from '@/lib/commandStore'
import { searchAdminAction, type SearchResult } from '@/app/admin/search-actions'

interface Item {
  key: string
  icon: string
  label: string
  sublabel?: string
  href: string
  group: string
}

const NAV: Item[] = [
  { key: 'nav-dash', icon: 'dashboard', label: 'Dashboard', href: '/admin', group: 'Go to' },
  { key: 'nav-inbox', icon: 'inbox', label: 'Responses', href: '/admin/inbox', group: 'Go to' },
  { key: 'nav-posts', icon: 'article', label: 'Posts', href: '/admin/posts', group: 'Go to' },
  { key: 'nav-forms', icon: 'dynamic_form', label: 'Forms', href: '/admin/forms', group: 'Go to' },
  { key: 'nav-work', icon: 'grid_view', label: 'Work', href: '/admin/work', group: 'Go to' },
  { key: 'nav-media', icon: 'image', label: 'Media', href: '/admin/media', group: 'Go to' },
  { key: 'nav-services', icon: 'design_services', label: 'Services', href: '/admin/services', group: 'Go to' },
  { key: 'nav-jobs', icon: 'work', label: 'Jobs', href: '/admin/jobs', group: 'Go to' },
  { key: 'nav-team', icon: 'group', label: 'Team', href: '/admin/team', group: 'Go to' },
  { key: 'nav-users', icon: 'manage_accounts', label: 'Users', href: '/admin/users', group: 'Go to' },
  { key: 'nav-settings', icon: 'settings', label: 'Settings', href: '/admin/settings', group: 'Go to' },
]

const ACTIONS: Item[] = [
  { key: 'act-post', icon: 'add', label: 'New post', href: '/admin/posts/new', group: 'Create' },
  { key: 'act-form', icon: 'add', label: 'New form', href: '/admin/forms', group: 'Create' },
  { key: 'act-work', icon: 'add', label: 'New project', href: '/admin/work/new', group: 'Create' },
  { key: 'act-service', icon: 'add', label: 'New service', href: '/admin/services/new', group: 'Create' },
  { key: 'act-job', icon: 'add', label: 'New job', href: '/admin/jobs/new', group: 'Create' },
  { key: 'act-team', icon: 'add', label: 'New team member', href: '/admin/team/new', group: 'Create' },
]

const RESULT_ICON: Record<SearchResult['type'], string> = {
  post: 'article', form: 'dynamic_form', job: 'work', submission: 'inbox',
}

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeCommand(setOpen), [])

  // Global ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        commandPalette.toggle()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Reset + focus on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  // Debounced content search
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (!q) { setResults([]); return }
    const t = setTimeout(() => {
      searchAdminAction(q).then(setResults).catch(() => setResults([]))
    }, 180)
    return () => clearTimeout(t)
  }, [query, open])

  // Build the flat, ordered item list for current query
  const items = useMemo<Item[]>(() => {
    const q = query.trim().toLowerCase()
    const staticItems = [...NAV, ...ACTIONS].filter(i => !q || i.label.toLowerCase().includes(q))
    const resultItems: Item[] = results.map(r => ({
      key: `res-${r.type}-${r.id}`,
      icon: RESULT_ICON[r.type],
      label: r.label,
      sublabel: r.sublabel,
      href: r.href,
      group: 'Results',
    }))
    return [...resultItems, ...staticItems]
  }, [query, results])

  useEffect(() => { setActive(0) }, [items.length])

  const close = useCallback(() => commandPalette.close(), [])

  const select = useCallback((item: Item | undefined) => {
    if (!item) return
    close()
    router.push(item.href)
  }, [close, router])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); select(items[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
  }, [items, active, select, close])

  // Keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  // Group items in display order while preserving the flat index
  let idx = -1
  const groups: { name: string; items: { item: Item; index: number }[] }[] = []
  for (const item of items) {
    idx++
    const last = groups[groups.length - 1]
    if (last && last.name === item.group) last.items.push({ item, index: idx })
    else groups.push({ name: item.group, items: [{ item, index: idx }] })
  }

  return (
    <div className="admin-cmdk-backdrop" onMouseDown={close}>
      <div className="admin-cmdk" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-cmdk__search">
          <Icon name="search" size={20} className="admin-cmdk__search-icon" />
          <input
            ref={inputRef}
            className="admin-cmdk__input"
            placeholder="Search or jump to…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="admin-cmdk__esc">esc</kbd>
        </div>

        <div className="admin-cmdk__list" ref={listRef}>
          {items.length === 0 ? (
            <div className="admin-cmdk__empty">No matches for “{query}”</div>
          ) : (
            groups.map(g => (
              <div key={g.name} className="admin-cmdk__group">
                <div className="admin-cmdk__group-label">{g.name}</div>
                {g.items.map(({ item, index }) => (
                  <button
                    key={item.key}
                    type="button"
                    data-idx={index}
                    className={`admin-cmdk__item ${index === active ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => select(item)}
                  >
                    <Icon name={item.icon} size={18} className="admin-cmdk__item-icon" />
                    <span className="admin-cmdk__item-label">{item.label}</span>
                    {item.sublabel && <span className="admin-cmdk__item-sub">{item.sublabel}</span>}
                    <Icon name="subdirectory_arrow_left" size={15} className="admin-cmdk__item-enter" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="admin-cmdk__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
