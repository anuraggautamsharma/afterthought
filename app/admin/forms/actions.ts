'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createForm, updateForm, deleteForm,
  createSection, updateSection, deleteSection,
  createField, updateField, deleteField, reorderFields,
  createFullForm, getFormBySiteRole, getFormById,
  type FormInput, type FieldInput, type SectionInput, type FormField,
  defaultFieldProps,
} from '@/lib/forms'
import { getJobByApplicationFormId } from '@/lib/jobs'
import { SYSTEM_FORM_SEEDS } from '@/lib/forms-seed'
import { slugify } from '@/lib/slugify'
import { supabase } from '@/lib/supabase'

// ── Forms ────────────────────────────────────────────────────────────────────

export async function createFormAction(): Promise<{ id: string }> {
  const form = await createForm({ title: 'Untitled form', status: 'draft' })
  // Create default first section
  await createSection({ form_id: form.id, title: '', description: '', sort_order: 0, skip_logic: [] })
  revalidatePath('/admin/forms')
  return { id: form.id }
}

export async function updateFormAction(id: string, input: FormInput) {
  await updateForm(id, input)
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${id}/edit`)
  revalidatePath(`/admin/forms/${id}/settings`)
}

export async function deleteFormAction(id: string) {
  await deleteForm(id)
  revalidatePath('/admin/forms')
  redirect('/admin/forms')
}

/** Delete used from the forms list (already on the page) — refresh, no redirect. */
export async function deleteFormFromListAction(id: string) {
  await deleteForm(id)
  revalidatePath('/admin/forms')
  revalidatePath('/admin/inbox')
}

export async function bulkDeleteFormsAction(ids: string[]) {
  await Promise.all(ids.map(id => deleteForm(id).catch(() => {})))
  revalidatePath('/admin/forms')
  revalidatePath('/admin/inbox')
}

export async function bulkSetFormStatusAction(ids: string[], status: 'published' | 'draft' | 'closed') {
  await Promise.all(ids.map(id => updateForm(id, { status }).catch(() => {})))
  revalidatePath('/admin/forms')
  revalidatePath('/admin/inbox')
}

export async function publishFormAction(id: string) {
  await updateForm(id, { status: 'published' })
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${id}/edit`)
}

export async function closeFormAction(id: string) {
  await updateForm(id, { status: 'closed' })
  revalidatePath('/admin/forms')
  revalidatePath(`/admin/forms/${id}/edit`)
}

/**
 * Idempotently creates the built-in system forms (Contact, Freelance) if a form
 * for that site role doesn't already exist. Safe to call repeatedly.
 */
export async function ensureSystemFormsAction(): Promise<{ created: string[] }> {
  const created: string[] = []
  for (const seed of SYSTEM_FORM_SEEDS) {
    if (!seed.site_role) continue
    const existing = await getFormBySiteRole(seed.site_role)
    if (existing) continue
    await createFullForm(seed)
    created.push(seed.title)
  }
  if (created.length > 0) {
    revalidatePath('/admin/forms')
    revalidatePath('/admin/inbox')
  }
  return { created }
}

// ── Sections ──────────────────────────────────────────────────────────────────

export async function createSectionAction(formId: string, sortOrder: number) {
  const section = await createSection({
    form_id: formId,
    title: '',
    description: '',
    sort_order: sortOrder,
    skip_logic: [],
  })
  revalidatePath(`/admin/forms/${formId}/edit`)
  return section
}

export async function updateSectionAction(id: string, formId: string, input: Partial<SectionInput>) {
  await updateSection(id, input)
  revalidatePath(`/admin/forms/${formId}/edit`)
}

export async function deleteSectionAction(id: string, formId: string) {
  await deleteSection(id)
  revalidatePath(`/admin/forms/${formId}/edit`)
}

// ── Fields ────────────────────────────────────────────────────────────────────

export async function createFieldAction(input: FieldInput) {
  const defaults = defaultFieldProps(input.type)
  const field = await createField({ ...defaults, ...input } as FieldInput)
  revalidatePath(`/admin/forms/${input.form_id}/edit`)
  return field
}

export async function updateFieldAction(id: string, formId: string, input: Partial<FormField>) {
  await updateField(id, input)
  revalidatePath(`/admin/forms/${formId}/edit`)
}

export async function deleteFieldAction(id: string, formId: string) {
  await deleteField(id)
  revalidatePath(`/admin/forms/${formId}/edit`)
}

export async function reorderFieldsAction(
  updates: { id: string; sort_order: number; section_id?: string | null }[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    await reorderFields(updates)
    return { ok: true }
  } catch (e) {
    console.error('[reorderFieldsAction] failed:', e)
    return { ok: false, error: e instanceof Error ? e.message : 'Reorder failed' }
  }
}

// ── Slug uniqueness check ──────────────────────────────────────────────────

export async function checkSlugAction(slug: string, excludeId?: string): Promise<boolean> {
  const base = slugify(slug)
  const { data } = await supabase
    .from('forms')
    .select('id')
    .eq('slug', base)
    .neq('id', excludeId ?? '')
    .limit(1)
  return (data ?? []).length === 0
}

// ── Share / usage info ─────────────────────────────────────────────────────────

export type FormUsage =
  | { kind: 'page'; label: string; path: string }
  | { kind: 'job'; label: string; path: string }
  | { kind: 'standalone' }

export interface FormShareInfo {
  slug: string
  status: 'draft' | 'published' | 'closed'
  usage: FormUsage
}

/** Resolves where a form is surfaced on the site, for the Share panel. */
export async function getFormUsageAction(formId: string): Promise<FormShareInfo | null> {
  const form = await getFormById(formId)
  if (!form) return null

  let usage: FormUsage = { kind: 'standalone' }
  if (form.site_role === 'contact') {
    usage = { kind: 'page', label: 'Contact page', path: '/contact' }
  } else if (form.site_role === 'freelance') {
    usage = { kind: 'page', label: 'Freelance page', path: '/careers/freelance' }
  } else {
    const job = await getJobByApplicationFormId(formId).catch(() => null)
    if (job) usage = { kind: 'job', label: job.title, path: `/careers/${job.slug}` }
  }

  return { slug: form.slug, status: form.status, usage }
}

// ── CSV Export ────────────────────────────────────────────────────────────────

export async function getFormCsvAction(formId: string): Promise<string> {
  const { data: form } = await supabase.from('forms').select('*').eq('id', formId).single()
  const { data: fields } = await supabase
    .from('form_fields').select('*').eq('form_id', formId).order('sort_order')
  const { data: submissions } = await supabase
    .from('submissions').select('*').eq('form_id', formId).order('created_at')

  if (!fields || !submissions) return ''

  const headers = ['Submitted at', 'Name', 'Email', ...fields.map((f: { label: string }) => f.label)]
  const rows = submissions.map((s: { created_at: string; name: string; email: string; responses: Record<string, unknown> }) => {
    const responses = s.responses ?? {}
    return [
      new Date(s.created_at).toISOString(),
      s.name ?? '',
      s.email ?? '',
      ...fields.map((f: { id: string }) => {
        const val = responses[f.id]
        if (Array.isArray(val)) return val.join(', ')
        return String(val ?? '')
      }),
    ]
  })

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  return [headers, ...rows].map(row => row.map(escape).join(',')).join('\n')
}
