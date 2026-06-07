import { getSubmissions, type Submission } from '@/lib/submissions'
import { getAllForms, getFields, getFormById, type FormField, type Form } from '@/lib/forms'
import InboxHub, { type InboxGroup } from '@/components/admin/InboxHub'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Inbox — Afterthought CMS' }

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string; form?: string; view?: string }>
}) {
  const { archived, form: formParam, view } = await searchParams
  const showArchived = archived === '1'
  const selected = formParam ?? 'all'
  const viewMode: 'list' | 'table' = view === 'table' ? 'table' : 'list'

  let submissions: Submission[] = []
  let forms: Form[] = []
  let dbError: string | null = null
  try {
    ;[submissions, forms] = await Promise.all([
      getSubmissions({ archived: showArchived }),
      getAllForms().catch(() => [] as Form[]),
    ])
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  // ── Build sidebar groups ──────────────────────────────────────────────
  const countsByForm = new Map<string, { total: number; unread: number }>()
  let legacyTotal = 0
  let legacyUnread = 0
  for (const s of submissions) {
    if (s.form_id) {
      const e = countsByForm.get(s.form_id) ?? { total: 0, unread: 0 }
      e.total += 1
      if (!s.is_read) e.unread += 1
      countsByForm.set(s.form_id, e)
    } else {
      legacyTotal += 1
      if (!s.is_read) legacyUnread += 1
    }
  }

  const formGroups: InboxGroup[] = forms
    .map(f => ({
      key: f.id,
      label: f.title || 'Untitled form',
      category: f.category,
      total: countsByForm.get(f.id)?.total ?? 0,
      unread: countsByForm.get(f.id)?.unread ?? 0,
    }))
    // Forms with responses first, then the rest alphabetically
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))

  if (legacyTotal > 0) {
    formGroups.push({
      key: 'legacy',
      label: 'Other / legacy',
      category: 'general',
      total: legacyTotal,
      unread: legacyUnread,
    })
  }

  const totalUnread = submissions.filter(s => !s.is_read).length

  // ── Filter the visible list by selected group ─────────────────────────
  const items =
    selected === 'all'
      ? submissions
      : selected === 'legacy'
        ? submissions.filter(s => !s.form_id)
        : submissions.filter(s => s.form_id === selected)

  // ── Table view needs the selected form's fields ───────────────────────
  let selectedForm: Form | null = null
  let selectedFields: FormField[] = []
  if (selected !== 'all' && selected !== 'legacy') {
    selectedForm = forms.find(f => f.id === selected) ?? (await getFormById(selected).catch(() => null))
    if (viewMode === 'table' && selectedForm) {
      selectedFields = await getFields(selected).catch(() => [] as FormField[])
    }
  }

  return (
    <>
      {dbError && (
        <div className="admin-db-error">
          <strong>Database error:</strong> {dbError}
        </div>
      )}
      <InboxHub
        groups={formGroups}
        allCount={submissions.length}
        allUnread={totalUnread}
        items={items}
        selected={selected}
        showArchived={showArchived}
        viewMode={viewMode}
        selectedForm={selectedForm}
        selectedFields={selectedFields}
      />
    </>
  )
}
