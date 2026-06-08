import { supabase } from './supabase'
import { slugify } from './slugify'

// ── Field Types ──────────────────────────────────────────────────────────────

export type FieldType =
  | 'short_text' | 'paragraph' | 'number' | 'email' | 'phone' | 'url'
  | 'radio' | 'checkboxes' | 'dropdown' | 'linear_scale' | 'star_rating'
  | 'date' | 'time' | 'datetime' | 'date_range'
  | 'file_upload' | 'signature' | 'image_choice' | 'matrix' | 'ranking' | 'slider'

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: 'Short text',
  paragraph: 'Paragraph',
  number: 'Number',
  email: 'Email',
  phone: 'Phone',
  url: 'URL',
  radio: 'Multiple choice',
  checkboxes: 'Checkboxes',
  dropdown: 'Dropdown',
  linear_scale: 'Linear scale',
  star_rating: 'Star rating',
  date: 'Date',
  time: 'Time',
  datetime: 'Date & time',
  date_range: 'Date range',
  file_upload: 'File upload',
  signature: 'Signature',
  image_choice: 'Image choice',
  matrix: 'Matrix / grid',
  ranking: 'Ranking',
  slider: 'Slider',
}

export const FIELD_GROUPS: { label: string; types: FieldType[] }[] = [
  { label: 'Text', types: ['short_text', 'paragraph', 'number', 'email', 'phone', 'url'] },
  { label: 'Choice', types: ['radio', 'checkboxes', 'dropdown', 'linear_scale', 'star_rating'] },
  { label: 'Date & Time', types: ['date', 'time', 'datetime', 'date_range'] },
  { label: 'Advanced', types: ['file_upload', 'signature', 'image_choice', 'matrix', 'ranking', 'slider'] },
]

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  short_text: '—',
  paragraph: '¶',
  number: '#',
  email: '@',
  phone: '☏',
  url: '⌘',
  radio: '◎',
  checkboxes: '☑',
  dropdown: '▾',
  linear_scale: '⋯',
  star_rating: '★',
  date: '▦',
  time: '◷',
  datetime: '◈',
  date_range: '↔',
  file_upload: '↑',
  signature: '✍',
  image_choice: '⊞',
  matrix: '⊟',
  ranking: '⇅',
  slider: '◁▷',
}

// ── Supporting Types ─────────────────────────────────────────────────────────

export interface FieldOption {
  label: string
  value: string
  image_url?: string
}

export type ConditionOp =
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty'

export interface VisibilityCondition {
  field_id: string
  op: ConditionOp
  value: string
}

export interface VisibilityRule {
  logic: 'and' | 'or'
  conditions: VisibilityCondition[]
}

export interface SkipLogicRule {
  conditions: VisibilityCondition[]
  target_section_id: string | null
}

export interface MatrixConfig {
  rows: string[]
  columns: string[]
  multi: boolean
}

export interface FileConfig {
  accepted_types: string[]
  max_size_mb: number
  max_files: number
}

// ── Core Models ──────────────────────────────────────────────────────────────

export interface FormField {
  id: string
  form_id: string
  section_id: string | null
  type: FieldType
  label: string
  description: string
  placeholder: string
  required: boolean
  read_only: boolean
  options: FieldOption[]
  shuffle_options: boolean
  min_value: number | null
  max_value: number | null
  step_value: number
  min_length: number | null
  max_length: number | null
  validation_pattern: string
  min_label: string
  max_label: string
  matrix_config: MatrixConfig | null
  file_config: FileConfig | null
  default_value: unknown
  visibility: VisibilityRule | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface FormSection {
  id: string
  form_id: string
  title: string
  description: string
  sort_order: number
  skip_logic: SkipLogicRule[]
  created_at: string
}

export type FormCategory =
  | 'contact' | 'application' | 'freelance' | 'newsletter'
  | 'survey' | 'event' | 'general'

export const FORM_CATEGORY_LABELS: Record<FormCategory, string> = {
  contact: 'Contact',
  application: 'Job application',
  freelance: 'Freelance',
  newsletter: 'Newsletter',
  survey: 'Survey',
  event: 'Event',
  general: 'General',
}

// Built-in site slots a form can be bound to. Null = link/embed only.
export type SiteRole = 'contact' | 'freelance' | null

export interface Form {
  id: string
  title: string
  slug: string
  description: string
  status: 'draft' | 'published' | 'closed'
  category: FormCategory
  site_role: SiteRole
  is_system: boolean
  theme_color: string
  header_image: string | null
  custom_font: string
  submit_label: string
  confirmation_type: 'message' | 'redirect'
  confirmation_message: string
  redirect_url: string
  show_progress: boolean
  show_question_numbers: boolean
  shuffle_questions: boolean
  password: string
  allowed_domains: string[]
  response_limit: number | null
  open_at: string | null
  close_at: string | null
  allow_edit_after_submit: boolean
  limit_one_response: boolean
  notify_emails: string[]
  auto_respond: boolean
  auto_respond_field: string
  auto_respond_subject: string
  auto_respond_body: string
  webhook_url: string
  created_at: string
  updated_at: string
}

export type FormInput = Partial<Omit<Form, 'id' | 'created_at' | 'updated_at'>>
export type FieldInput = Partial<Omit<FormField, 'id' | 'created_at' | 'updated_at'>>
  & { type: FieldType; label: string; form_id: string }
export type SectionInput = Partial<Omit<FormSection, 'id' | 'created_at'>> & { form_id: string }

// ── Default field values by type ─────────────────────────────────────────────

export function defaultFieldProps(type: FieldType): Partial<FormField> {
  const base = {
    description: '', placeholder: '', required: false, read_only: false,
    options: [], shuffle_options: false,
    min_value: null, max_value: null, step_value: 1,
    min_length: null, max_length: null, validation_pattern: '',
    min_label: '', max_label: '',
    matrix_config: null, file_config: null, default_value: null, visibility: null,
  }
  switch (type) {
    case 'short_text': return { ...base, placeholder: 'Your answer' }
    case 'paragraph': return { ...base, placeholder: 'Your answer' }
    case 'number': return { ...base, placeholder: '0', min_value: null, max_value: null }
    case 'email': return { ...base, placeholder: 'name@example.com' }
    case 'phone': return { ...base, placeholder: '+1 (555) 000-0000' }
    case 'url': return { ...base, placeholder: 'https://' }
    case 'radio':
    case 'checkboxes':
    case 'image_choice':
      return { ...base, options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ]}
    case 'dropdown':
      return { ...base, options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
      ]}
    case 'linear_scale': return { ...base, min_value: 1, max_value: 5, min_label: 'Not at all', max_label: 'Extremely' }
    case 'star_rating': return { ...base, max_value: 5 }
    case 'slider': return { ...base, min_value: 0, max_value: 100, step_value: 1 }
    case 'matrix': return { ...base, matrix_config: { rows: ['Row 1', 'Row 2'], columns: ['Col 1', 'Col 2', 'Col 3'], multi: false } }
    case 'ranking': return { ...base, options: [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
      { label: 'Option 3', value: 'option_3' },
    ]}
    case 'file_upload': return { ...base, file_config: { accepted_types: [], max_size_mb: 10, max_files: 1 } }
    default: return base
  }
}

// ── Forms CRUD ───────────────────────────────────────────────────────────────

export async function getAllForms(): Promise<Form[]> {
  const { data, error } = await supabase
    .from('forms').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Form[]
}

export async function getFormById(id: string): Promise<Form | null> {
  const { data } = await supabase.from('forms').select('*').eq('id', id).single()
  return data as Form | null
}

export async function getFormBySlug(slug: string): Promise<Form | null> {
  const { data } = await supabase.from('forms').select('*').eq('slug', slug).single()
  return data as Form | null
}

export async function getFormBySiteRole(role: NonNullable<SiteRole>): Promise<Form | null> {
  const { data } = await supabase.from('forms').select('*').eq('site_role', role).maybeSingle()
  return data as Form | null
}

export async function createForm(input: FormInput = {}): Promise<Form> {
  const title = input.title ?? 'Untitled form'
  const slug = input.slug ?? await uniqueFormSlug(slugify(title))
  // Spread input first so the computed title/slug always win (input may carry
  // an undefined slug which would otherwise clobber the generated one).
  const { data, error } = await supabase
    .from('forms')
    .insert({ ...input, title, slug })
    .select().single()
  if (error) throw error
  return data as Form
}

export async function updateForm(id: string, input: FormInput): Promise<Form> {
  const { data, error } = await supabase
    .from('forms')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data as Form
}

export async function deleteForm(id: string): Promise<void> {
  const { error } = await supabase.from('forms').delete().eq('id', id)
  if (error) throw error
}

async function uniqueFormSlug(base: string): Promise<string> {
  const { data } = await supabase.from('forms').select('slug').like('slug', `${base}%`)
  const existing = new Set((data ?? []).map((r: { slug: string }) => r.slug))
  if (!existing.has(base)) return base
  let i = 2
  while (existing.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

// ── Sections CRUD ────────────────────────────────────────────────────────────

export async function getSections(formId: string): Promise<FormSection[]> {
  const { data, error } = await supabase
    .from('form_sections').select('*').eq('form_id', formId).order('sort_order')
  if (error) throw error
  return (data ?? []) as FormSection[]
}

export async function createSection(input: SectionInput): Promise<FormSection> {
  const { data, error } = await supabase.from('form_sections').insert(input).select().single()
  if (error) throw error
  return data as FormSection
}

export async function updateSection(id: string, input: Partial<FormSection>): Promise<FormSection> {
  const { data, error } = await supabase
    .from('form_sections').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as FormSection
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('form_sections').delete().eq('id', id)
  if (error) throw error
}

// ── Fields CRUD ──────────────────────────────────────────────────────────────

export async function getFields(formId: string): Promise<FormField[]> {
  const { data, error } = await supabase
    .from('form_fields').select('*').eq('form_id', formId).order('sort_order')
  if (error) throw error
  return (data ?? []) as FormField[]
}

export async function createField(input: FieldInput): Promise<FormField> {
  const { data, error } = await supabase.from('form_fields').insert(input).select().single()
  if (error) throw error
  return data as FormField
}

export async function updateField(id: string, input: Partial<FormField>): Promise<FormField> {
  const { data, error } = await supabase
    .from('form_fields')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data as FormField
}

export async function deleteField(id: string): Promise<void> {
  const { error } = await supabase.from('form_fields').delete().eq('id', id)
  if (error) throw error
}

export async function reorderFields(updates: { id: string; sort_order: number; section_id?: string | null }[]): Promise<void> {
  // Sequential + error-checked: avoids parallel write races and surfaces real errors.
  for (const { id, sort_order, section_id } of updates) {
    const patch: Record<string, unknown> = { sort_order }
    if (section_id !== undefined) patch.section_id = section_id
    const { error } = await supabase.from('form_fields').update(patch).eq('id', id)
    if (error) throw new Error(error.message)
  }
}

// ── Full form creation (seeding) ─────────────────────────────────────────────

export interface SeedFieldSpec {
  type: FieldType
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  options?: FieldOption[]
}

export interface SeedFormSpec {
  title: string
  slug?: string
  description?: string
  category: FormCategory
  site_role?: NonNullable<SiteRole>
  is_system?: boolean
  status?: Form['status']
  submit_label?: string
  confirmation_message?: string
  fields: SeedFieldSpec[]
}

/**
 * Creates a form with a single default section and the given fields, atomically
 * enough for seeding. Returns the created form.
 */
export async function createFullForm(spec: SeedFormSpec): Promise<Form> {
  const form = await createForm({
    title: spec.title,
    slug: spec.slug,
    description: spec.description ?? '',
    category: spec.category,
    site_role: spec.site_role ?? null,
    is_system: spec.is_system ?? false,
    status: spec.status ?? 'published',
    submit_label: spec.submit_label,
    confirmation_message: spec.confirmation_message,
  })

  const section = await createSection({ form_id: form.id, title: '', description: '', sort_order: 0 })

  let order = 0
  for (const f of spec.fields) {
    const defaults = defaultFieldProps(f.type)
    await createField({
      ...defaults,
      form_id: form.id,
      section_id: section.id,
      type: f.type,
      label: f.label,
      required: f.required ?? false,
      description: f.description ?? '',
      placeholder: f.placeholder ?? defaults.placeholder ?? '',
      options: f.options ?? defaults.options ?? [],
      sort_order: order++,
    } as FieldInput)
  }

  return form
}

// ── Full form fetch ──────────────────────────────────────────────────────────

export interface FormWithContent {
  form: Form
  sections: FormSection[]
  fields: FormField[]
}

export async function getFormWithContent(id: string): Promise<FormWithContent | null> {
  const [form, sections, fields] = await Promise.all([
    getFormById(id),
    getSections(id),
    getFields(id),
  ])
  if (!form) return null
  return { form, sections, fields }
}

// ── Responses ────────────────────────────────────────────────────────────────

export async function getFormResponses(formId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getFormResponseCount(formId: string): Promise<number> {
  const { count } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('form_id', formId)
  return count ?? 0
}
