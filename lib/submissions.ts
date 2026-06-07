import { supabase } from './supabase'

// Legacy types kept for back-compat; new submissions inherit their form's
// category (contact | application | freelance | newsletter | survey | event | general).
export type SubmissionType = string

export interface Submission {
  id: string
  type: SubmissionType
  name: string
  email: string
  subject: string
  message: string
  data: Record<string, unknown>
  form_id: string | null
  responses: Record<string, unknown>
  is_read: boolean
  is_archived: boolean
  created_at: string
}

export type SubmissionInput = {
  type: SubmissionType
  name?: string
  email?: string
  subject?: string
  message?: string
  data?: Record<string, unknown>
  form_id?: string | null
  responses?: Record<string, unknown>
}

export async function createSubmission(input: SubmissionInput): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      type: input.type,
      name: input.name ?? '',
      email: input.email ?? '',
      subject: input.subject ?? '',
      message: input.message ?? '',
      data: input.data ?? {},
      form_id: input.form_id ?? null,
      responses: input.responses ?? {},
    })
    .select()
    .single()
  if (error) throw error
  return data as Submission
}

export async function getSubmissions(
  opts: { archived?: boolean; formId?: string } = {}
): Promise<Submission[]> {
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('is_archived', opts.archived ?? false)
    .order('created_at', { ascending: false })
  if (opts.formId) query = query.eq('form_id', opts.formId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Submission[]
}

// ── Inbox grouping: forms + their unread counts ───────────────────────────────
export interface InboxFormGroup {
  form_id: string | null
  title: string
  category: string
  total: number
  unread: number
}

/**
 * Builds the inbox sidebar: one row per form that has received submissions,
 * plus a synthetic group (form_id: null) for legacy/unlinked submissions.
 */
export async function getInboxGroups(
  opts: { archived?: boolean } = {}
): Promise<InboxFormGroup[]> {
  const subs = await getSubmissions({ archived: opts.archived ?? false })

  // Collect counts per form_id
  const counts = new Map<string | null, { total: number; unread: number }>()
  for (const s of subs) {
    const key = s.form_id ?? null
    const entry = counts.get(key) ?? { total: 0, unread: 0 }
    entry.total += 1
    if (!s.is_read) entry.unread += 1
    counts.set(key, entry)
  }

  // Resolve form titles/categories for the linked groups
  const formIds = [...counts.keys()].filter((k): k is string => k !== null)
  const titles = new Map<string, { title: string; category: string }>()
  if (formIds.length > 0) {
    const { data } = await supabase
      .from('forms')
      .select('id, title, category')
      .in('id', formIds)
    for (const f of (data ?? []) as { id: string; title: string; category: string }[]) {
      titles.set(f.id, { title: f.title, category: f.category })
    }
  }

  const groups: InboxFormGroup[] = []
  for (const [formId, { total, unread }] of counts.entries()) {
    if (formId === null) {
      groups.push({ form_id: null, title: 'Other / legacy', category: 'general', total, unread })
    } else {
      const meta = titles.get(formId)
      groups.push({
        form_id: formId,
        title: meta?.title ?? 'Untitled form',
        category: meta?.category ?? 'general',
        total,
        unread,
      })
    }
  }

  // Sort: most unread first, then most total
  groups.sort((a, b) => b.unread - a.unread || b.total - a.total)
  return groups
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const { data, error } = await supabase.from('submissions').select('*').eq('id', id).single()
  if (error) return null
  return data as Submission
}

export async function setSubmissionRead(id: string, read: boolean): Promise<void> {
  const { error } = await supabase.from('submissions').update({ is_read: read }).eq('id', id)
  if (error) throw error
}

export async function setSubmissionArchived(id: string, archived: boolean): Promise<void> {
  const { error } = await supabase.from('submissions').update({ is_archived: archived }).eq('id', id)
  if (error) throw error
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await supabase.from('submissions').delete().eq('id', id)
  if (error) throw error
}

export async function countUnread(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('is_archived', false)
    if (error) return 0
    return count ?? 0
  } catch {
    return 0
  }
}
