import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { jwtVerify, createRemoteJWKSet, decodeProtectedHeader, decodeJwt } from 'jose'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { COLLECTIONS, getCollection } from '@/lib/mcp/registry'
import {
  getSubmissions, getSubmissionById, setSubmissionRead, setSubmissionArchived,
  deleteSubmission, type Submission,
} from '@/lib/submissions'
import {
  getAllForms, getFields, getSections, createSection, createField, updateField,
  deleteField, defaultFieldProps, formatAnswerForDisplay, asStoredFiles,
  collectStoredFilePaths, createFullForm, duplicateForm,
  FORM_CATEGORY_LABELS, type FormCategory, type Form, type FieldType,
  type FieldOption, type SeedFieldSpec,
} from '@/lib/forms'
import { deleteFormFiles } from '@/lib/storage'
import { getAllJobs, getJobById, createJob, updateJob } from '@/lib/jobs'
import { applicationFormSpec } from '@/lib/forms-seed'
import { slugify } from '@/lib/slugify'
import { estimateReadTime } from '@/lib/slugify'
import { buildPostContent, plainTextToContent, type PostBlock } from '@/lib/mcp/postBlocks'
import { listMedia, uploadImageFromUrl } from '@/lib/media'

export const maxDuration = 60

const text = (data: unknown) => ({
  content: [{ type: 'text' as const, text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
})

function catLabel(c: string) {
  return FORM_CATEGORY_LABELS[c as FormCategory] ?? c
}

const handler = createMcpHandler(
  server => {
    // ── Discovery ────────────────────────────────────────────────────────────
    server.tool(
      'list_collections',
      'List the CMS content collections available to read (posts, jobs, forms, work, services, team). Use the returned `name` as the `collection` argument for list_records / get_record.',
      {},
      async () => text(COLLECTIONS.map(c => ({ name: c.name, label: c.label, description: c.description }))),
    )

    // ── Generic read over ANY registered collection ──────────────────────────
    server.tool(
      'list_records',
      'List all records in a CMS collection. `collection` must be one of the names from list_collections.',
      { collection: z.string().describe('Collection name, e.g. "posts", "jobs", "work"'), limit: z.number().optional().describe('Max records to return') },
      async ({ collection, limit }) => {
        const c = getCollection(collection)
        if (!c) return text({ error: `Unknown collection "${collection}". Call list_collections.` })
        const rows = await c.list()
        return text(typeof limit === 'number' ? rows.slice(0, limit) : rows)
      },
    )

    server.tool(
      'get_record',
      'Get a single record by id from a CMS collection.',
      { collection: z.string().describe('Collection name'), id: z.string().describe('Record id') },
      async ({ collection, id }) => {
        const c = getCollection(collection)
        if (!c) return text({ error: `Unknown collection "${collection}". Call list_collections.` })
        const row = await c.get(id)
        return text(row ?? { error: 'Not found' })
      },
    )

    // ── Responses (richer querying than the generic collection) ──────────────
    server.tool(
      'list_responses',
      'List form responses / submissions. Optionally filter by form (slug), unread only, and a recent time window in days.',
      {
        form_slug: z.string().optional().describe('Limit to one form by its slug'),
        unread_only: z.boolean().optional().describe('Only unread responses'),
        days: z.number().optional().describe('Only responses from the last N days'),
        archived: z.boolean().optional().describe('Show archived instead of active'),
        limit: z.number().optional().describe('Max responses (default 50)'),
      },
      async ({ form_slug, unread_only, days, archived, limit }) => {
        const [subs, forms] = await Promise.all([
          getSubmissions({ archived: !!archived }),
          getAllForms().catch(() => [] as Form[]),
        ])
        const formBySlug = form_slug ? forms.find(f => f.slug === form_slug) : null
        const titleById = Object.fromEntries(forms.map(f => [f.id, f.title]))
        const cutoff = typeof days === 'number' ? Date.now() - days * 86400000 : null

        const rows = subs
          .filter(s => (formBySlug ? s.form_id === formBySlug.id : true))
          .filter(s => (unread_only ? !s.is_read : true))
          .filter(s => (cutoff !== null ? new Date(s.created_at).getTime() >= cutoff : true))
          .slice(0, limit ?? 50)
          .map(s => ({
            id: s.id,
            submitted_at: s.created_at,
            unread: !s.is_read,
            type: catLabel(s.type),
            name: s.name || null,
            email: s.email || null,
            form: s.form_id ? (titleById[s.form_id] ?? null) : null,
            subject: s.subject || null,
          }))

        return text({ count: rows.length, responses: rows })
      },
    )

    server.tool(
      'get_response',
      'Get the full detail of one form response by id, with every field answer (choice values resolved to labels, files listed by name).',
      { id: z.string().describe('Response/submission id') },
      async ({ id }) => {
        const s: Submission | null = await getSubmissionById(id)
        if (!s) return text({ error: 'Not found' })
        const fields = s.form_id ? await getFields(s.form_id).catch(() => []) : []
        const answers = (s.responses ?? {}) as Record<string, unknown>
        const detail = fields.map(f => ({
          field: f.label,
          value: f.type === 'file_upload'
            ? asStoredFiles(answers[f.id]).map(file => file.name)
            : formatAnswerForDisplay(f, answers[f.id]),
        }))
        return text({
          id: s.id,
          submitted_at: s.created_at,
          unread: !s.is_read,
          type: catLabel(s.type),
          name: s.name || null,
          email: s.email || null,
          subject: s.subject || null,
          answers: detail,
        })
      },
    )

    // ── Jobs helper (counts of applications) ─────────────────────────────────
    server.tool(
      'list_jobs_with_response_counts',
      'List jobs together with how many applications each has received.',
      {},
      async () => {
        const [jobs, subs] = await Promise.all([getAllJobs(), getSubmissions({})])
        const byJob = new Map<string, number>()
        for (const s of subs) if (s.job_id) byJob.set(s.job_id, (byJob.get(s.job_id) ?? 0) + 1)
        return text(jobs.map(j => ({ id: j.id, title: j.title, slug: j.slug, status: j.status, applications: byJob.get(j.id) ?? 0 })))
      },
    )

    // ══ WRITE TOOLS ═══════════════════════════════════════════════════════════
    const SITE = 'https://www.afterthought.design'
    const touch = (...paths: string[]) => { for (const p of paths) { try { revalidatePath(p) } catch {} } }

    server.tool(
      'create_job',
      'Create a new job posting on the careers page. status "open" publishes it live; "closed" keeps it hidden. Put the full job description in `description` (separate paragraphs with blank lines).',
      {
        title: z.string().describe('Job title, e.g. "Senior Motion Designer"'),
        type: z.string().optional().describe('e.g. Full-time, Contract'),
        location: z.string().optional(),
        summary: z.string().optional().describe('One–two line teaser shown on the careers list'),
        description: z.string().optional().describe('Full JD; blank lines separate paragraphs'),
        what_youll_do: z.array(z.string()).optional().describe('Bullet points'),
        looking_for: z.array(z.string()).optional().describe('Bullet points'),
        nice_to_have: z.string().optional(),
        why_afterthought: z.string().optional(),
        status: z.enum(['open', 'closed']).optional().describe('Default "open" (live)'),
      },
      async (a) => {
        const job = await createJob({
          title: a.title,
          slug: slugify(a.title),
          type: a.type ?? 'Full-time',
          location: a.location ?? '',
          summary: a.summary ?? '',
          description: a.description ?? '',
          what_youll_do: a.what_youll_do ?? [],
          looking_for: a.looking_for ?? [],
          nice_to_have: a.nice_to_have ?? '',
          why_afterthought: a.why_afterthought ?? '',
          status: a.status ?? 'open',
          sort_order: 0,
        })
        touch('/careers', '/admin/jobs')
        return text({
          ok: true, id: job.id, slug: job.slug, status: job.status,
          public_url: `${SITE}/careers/${job.slug}`,
          admin_url: `${SITE}/admin/jobs/${job.id}`,
          next: 'Call create_application_form_for_job with this id to add an application form.',
        })
      },
    )

    server.tool(
      'update_job',
      'Update an existing job. Change `status` to "open"/"closed" to publish/unpublish, or edit any field.',
      {
        id: z.string(),
        title: z.string().optional(),
        type: z.string().optional(),
        location: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        what_youll_do: z.array(z.string()).optional(),
        looking_for: z.array(z.string()).optional(),
        nice_to_have: z.string().optional(),
        why_afterthought: z.string().optional(),
        status: z.enum(['open', 'closed']).optional(),
      },
      async ({ id, ...rest }) => {
        const patch = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined))
        const job = await updateJob(id, patch)
        touch('/careers', `/careers/${job.slug}`, '/admin/jobs')
        return text({ ok: true, id: job.id, status: job.status, public_url: `${SITE}/careers/${job.slug}` })
      },
    )

    server.tool(
      'create_application_form_for_job',
      'Create and attach a standard application form to a job, so candidates can apply on the job page.',
      { job_id: z.string() },
      async ({ job_id }) => {
        const job = await getJobById(job_id)
        if (!job) return text({ error: 'Job not found' })
        if (job.application_form_id) {
          return text({ ok: true, form_id: job.application_form_id, note: 'Job already has a form', edit_url: `${SITE}/admin/forms/${job.application_form_id}/edit` })
        }
        const form = await createFullForm(applicationFormSpec(job.title))
        await updateJob(job_id, { application_form_id: form.id })
        touch('/careers', `/careers/${job.slug}`, '/admin/forms')
        return text({ ok: true, form_id: form.id, edit_url: `${SITE}/admin/forms/${form.id}/edit` })
      },
    )

    // Generic writes over any registered collection that supports them.
    server.tool(
      'create_record',
      'Create a record in a collection that supports it (e.g. "posts", "jobs"). Pass `data` as the fields.',
      { collection: z.string(), data: z.record(z.any()) },
      async ({ collection, data }) => {
        const c = getCollection(collection)
        if (!c?.create) return text({ error: `Collection "${collection}" can't be created via MCP.` })
        const rec = await c.create(data as Record<string, unknown>)
        touch('/', '/careers', '/thinking')
        return text({ ok: true, record: rec })
      },
    )

    server.tool(
      'update_record',
      'Update fields on a record in a collection. e.g. publish a post with data {"status":"published"}, or a form with {"status":"published"}.',
      { collection: z.string(), id: z.string(), data: z.record(z.any()) },
      async ({ collection, id, data }) => {
        const c = getCollection(collection)
        if (!c?.update) return text({ error: `Collection "${collection}" can't be updated via MCP.` })
        const rec = await c.update(id, data as Record<string, unknown>)
        touch('/', '/careers', '/thinking', '/services', '/work')
        return text({ ok: true, record: rec })
      },
    )

    server.tool(
      'delete_record',
      'Permanently delete a record from a collection (posts, jobs, forms, work, services, team). This cannot be undone.',
      { collection: z.string(), id: z.string() },
      async ({ collection, id }) => {
        const c = getCollection(collection)
        if (!c?.remove) return text({ error: `Collection "${collection}" can't be deleted via MCP.` })
        await c.remove(id)
        touch('/', '/careers', '/thinking', '/services', '/work')
        return text({ ok: true, deleted: id })
      },
    )

    // ── Posts (rich content from plain text) ─────────────────────────────────
    server.tool(
      'create_post',
      'Create a fully-formatted blog post. Prefer `blocks` for rich content: an ordered array of { type, ... }. Block types: paragraph {text}, heading {text, level 2|3}, image {url, alt?, ratio? natural|16-9|square}, video {url} (YouTube/Vimeo), quote {text}, bullet_list {items[]}, ordered_list {items[]}, divider {}. Text supports **bold**, *italic*, [label](url). Image/video urls must be publicly hosted — use upload_image_from_url first for external images, or list_media to reuse existing ones. `cover_image` is the hero (recommend 1600x900); `cover_focal` crops it. `faqs` adds an FAQ section + FAQPage schema. status "published" makes it live; default "draft". If you have only plain text, pass `body` instead of `blocks`.',
      {
        title: z.string(),
        blocks: z.array(z.object({
          type: z.enum(['paragraph', 'heading', 'image', 'video', 'quote', 'bullet_list', 'ordered_list', 'divider']),
          text: z.string().optional(),
          level: z.number().optional(),
          url: z.string().optional(),
          alt: z.string().optional(),
          ratio: z.enum(['natural', '16-9', 'square']).optional(),
          items: z.array(z.string()).optional(),
        })).optional().describe('Rich content blocks, in order'),
        body: z.string().optional().describe('Plain-text fallback if blocks are not used; blank lines separate paragraphs'),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        cover_image: z.string().optional().describe('Hero image URL (publicly hosted)'),
        cover_focal: z.enum(['top', 'center', 'bottom']).optional(),
        meta_title: z.string().optional(),
        meta_description: z.string().optional(),
        focus_keyword: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
        faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional()
          .describe('Optional Q&A pairs shown at the end of the post'),
      },
      async (a) => {
        const c = getCollection('posts')!
        const content = a.blocks && a.blocks.length
          ? buildPostContent(a.blocks as PostBlock[])
          : plainTextToContent(a.body ?? '')
        const post = await c.create!({
          title: a.title, slug: slugify(a.title), excerpt: a.excerpt ?? '',
          content, category: a.category ?? 'General', status: a.status ?? 'draft',
          cover_image: a.cover_image ?? null,
          cover_focal: a.cover_focal ?? 'center',
          meta_title: a.meta_title ?? null,
          meta_description: a.meta_description ?? null,
          focus_keyword: a.focus_keyword ?? null,
          read_time: estimateReadTime(content),
          faqs: (a.faqs ?? []).map(f => ({ q: f.question, a: f.answer })),
          published_at: a.status === 'published' ? new Date().toISOString() : null,
        }) as { id: string; slug: string }
        touch('/thinking', '/admin/posts')
        return text({ ok: true, id: post.id, slug: post.slug, public_url: `${SITE}/thinking/${post.slug}`, admin_url: `${SITE}/admin/posts/${post.id}` })
      },
    )

    // ── Media (images for posts) ──────────────────────────────────────────────
    server.tool(
      'list_media',
      'List images already in the media library (name + public URL). Reuse these as post images or covers.',
      {},
      async () => {
        const items = await listMedia()
        return text({ count: items.length, media: items.map(m => ({ name: m.name, url: m.url })) })
      },
    )

    server.tool(
      'upload_image_from_url',
      'Fetch an external image URL and host it in the media library, returning a public URL you can use as a post image or cover. Use this for any image not already hosted on our domain.',
      {
        url: z.string().describe('Source image URL to fetch and host'),
        name: z.string().optional().describe('Optional base filename'),
      },
      async (a) => {
        try {
          const r = await uploadImageFromUrl(a.url, a.name)
          touch('/admin/media')
          return text({ ok: true, url: r.url, name: r.name })
        } catch (e) {
          return text({ ok: false, error: e instanceof Error ? e.message : 'Upload failed' })
        }
      },
    )

    // ── Form building ────────────────────────────────────────────────────────
    const toOptions = (opts?: string[]): FieldOption[] => (opts ?? []).map(label => ({ label, value: label }))
    async function firstSectionId(formId: string): Promise<string> {
      const secs = await getSections(formId)
      if (secs.length) return [...secs].sort((a, b) => a.sort_order - b.sort_order)[0].id
      const s = await createSection({ form_id: formId, title: '', description: '', sort_order: 0, skip_logic: [] })
      return s.id
    }

    server.tool(
      'create_form',
      'Create a builder form with fields in one call. Each field: { type, label, required?, options? }. Field types: short_text, paragraph, number, email, phone, url, radio, checkboxes, dropdown, linear_scale, star_rating, date, time, datetime, date_range, file_upload. `options` (array of strings) is for choice types. status "published" makes it live.',
      {
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(['contact', 'application', 'freelance', 'newsletter', 'survey', 'event', 'general']).optional(),
        status: z.enum(['draft', 'published']).optional(),
        fields: z.array(z.object({
          type: z.string(),
          label: z.string(),
          required: z.boolean().optional(),
          options: z.array(z.string()).optional(),
        })),
      },
      async (a) => {
        const spec: SeedFieldSpec[] = a.fields.map(f => ({
          type: f.type as FieldType,
          label: f.label,
          required: f.required ?? false,
          options: toOptions(f.options),
        }))
        const form = await createFullForm({
          title: a.title,
          description: a.description ?? '',
          category: (a.category ?? 'general') as FormCategory,
          status: a.status ?? 'draft',
          fields: spec,
        })
        touch('/admin/forms')
        return text({ ok: true, id: form.id, slug: form.slug, status: form.status, edit_url: `${SITE}/admin/forms/${form.id}/edit`, public_url: `${SITE}/forms/${form.slug}` })
      },
    )

    server.tool(
      'add_field',
      'Add a field to an existing form. `options` (strings) for choice types.',
      {
        form_id: z.string(),
        type: z.string(),
        label: z.string(),
        required: z.boolean().optional(),
        placeholder: z.string().optional(),
        description: z.string().optional(),
        options: z.array(z.string()).optional(),
      },
      async (a) => {
        const sectionId = await firstSectionId(a.form_id)
        const existing = await getFields(a.form_id)
        const defaults = defaultFieldProps(a.type as FieldType)
        const field = await createField({
          ...defaults,
          form_id: a.form_id,
          section_id: sectionId,
          type: a.type as FieldType,
          label: a.label,
          required: a.required ?? false,
          placeholder: a.placeholder ?? defaults.placeholder ?? '',
          description: a.description ?? '',
          options: toOptions(a.options).length ? toOptions(a.options) : (defaults.options ?? []),
          sort_order: existing.length,
        })
        touch(`/admin/forms/${a.form_id}/edit`)
        return text({ ok: true, field_id: field.id })
      },
    )

    server.tool(
      'update_field',
      'Edit a form field (label, required, options, placeholder, description).',
      {
        id: z.string(),
        form_id: z.string(),
        label: z.string().optional(),
        required: z.boolean().optional(),
        placeholder: z.string().optional(),
        description: z.string().optional(),
        options: z.array(z.string()).optional(),
      },
      async ({ id, form_id, options, ...rest }) => {
        const patch: Record<string, unknown> = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined))
        if (options) patch.options = toOptions(options)
        await updateField(id, patch)
        touch(`/admin/forms/${form_id}/edit`)
        return text({ ok: true })
      },
    )

    server.tool(
      'delete_field',
      'Delete a field from a form.',
      { id: z.string(), form_id: z.string() },
      async ({ id, form_id }) => {
        await deleteField(id)
        touch(`/admin/forms/${form_id}/edit`)
        return text({ ok: true })
      },
    )

    server.tool(
      'duplicate_form',
      'Duplicate a form (deep copy of its fields) as a new draft.',
      { form_id: z.string() },
      async ({ form_id }) => {
        const copy = await duplicateForm(form_id)
        touch('/admin/forms')
        return text({ ok: true, id: copy.id, slug: copy.slug, edit_url: `${SITE}/admin/forms/${copy.id}/edit` })
      },
    )

    // ── Responses / submissions actions ──────────────────────────────────────
    server.tool(
      'mark_response_read',
      'Mark a form response as read or unread.',
      { id: z.string(), read: z.boolean().optional() },
      async ({ id, read }) => { await setSubmissionRead(id, read ?? true); touch('/admin/inbox'); return text({ ok: true }) },
    )

    server.tool(
      'archive_response',
      'Archive (or restore) a form response.',
      { id: z.string(), archived: z.boolean().optional() },
      async ({ id, archived }) => { await setSubmissionArchived(id, archived ?? true); touch('/admin/inbox'); return text({ ok: true }) },
    )

    server.tool(
      'delete_response',
      'Permanently delete a form response and its uploaded files. Cannot be undone.',
      { id: z.string() },
      async ({ id }) => {
        const sub = await getSubmissionById(id).catch(() => null)
        if (sub) {
          const paths = collectStoredFilePaths(sub.responses as Record<string, unknown>)
          if (paths.length) await deleteFormFiles(paths).catch(() => {})
        }
        await deleteSubmission(id)
        touch('/admin/inbox')
        return text({ ok: true, deleted: id })
      },
    )

    server.tool(
      'export_responses_csv',
      'Return all responses for a form as CSV text (choice values resolved to labels, files as names).',
      { form_id: z.string() },
      async ({ form_id }) => {
        const [fields, subs] = await Promise.all([
          getFields(form_id).catch(() => []),
          getSubmissions({}).then(all => all.filter(s => s.form_id === form_id)),
        ])
        const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`
        const headers = ['Submitted at', 'Name', 'Email', ...fields.map(f => f.label)]
        const rows = subs.map(s => {
          const r = (s.responses ?? {}) as Record<string, unknown>
          return [
            new Date(s.created_at).toISOString(), s.name ?? '', s.email ?? '',
            ...fields.map(f => { const v = formatAnswerForDisplay(f, r[f.id]); return v === '—' ? '' : v }),
          ]
        })
        const csv = [headers, ...rows].map(row => row.map(esc).join(',')).join('\n')
        return text(csv)
      },
    )
  },
  {
    serverInfo: { name: 'afterthought-cms', version: '1.0.0' },
  },
  {
    basePath: '/api',
    disableSse: true,
    maxDuration: 60,
  },
)

// ── Auth ──────────────────────────────────────────────────────────────────────
// Two ways to authenticate:
//  1. WorkOS AuthKit login (OAuth) — used by claude.ai web/mobile connectors.
//  2. A static bearer token (MCP_BEARER_TOKEN) — handy for tools like the MCP
//     Inspector. Optional; if unset, only the WorkOS path works.

// WorkOS can sign these tokens with keys from a few different JWKS endpoints
// depending on the flow. We build a candidate list (discovered + conventional)
// and accept the token if ANY of them verifies it.
const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID || 'client_01KTMK4B05F0Y74BP6JBJCQFJZ'
let _jwksList: Array<ReturnType<typeof createRemoteJWKSet>> | null = null

async function getJwksList(): Promise<Array<ReturnType<typeof createRemoteJWKSet>>> {
  if (_jwksList) return _jwksList
  const list: Array<ReturnType<typeof createRemoteJWKSet>> = []
  const seen = new Set<string>()
  const add = (uri: string) => {
    if (uri && !seen.has(uri)) { seen.add(uri); try { list.push(createRemoteJWKSet(new URL(uri))) } catch {} }
  }
  const domain = (process.env.WORKOS_AUTHKIT_DOMAIN || '').replace(/\/+$/, '')

  // 1. Whatever the AuthKit authorization-server metadata advertises.
  if (domain) {
    for (const p of ['/.well-known/oauth-authorization-server', '/.well-known/openid-configuration']) {
      try {
        const r = await fetch(domain + p)
        if (r.ok) { const m = await r.json(); if (m?.jwks_uri) add(m.jwks_uri) }
      } catch { /* ignore */ }
    }
    add(`${domain}/oauth2/jwks`)
  }
  // 2. WorkOS SSO / User Management JWKS for this client.
  add(`https://api.workos.com/sso/jwks/${WORKOS_CLIENT_ID}`)

  _jwksList = list
  return list
}

const verifyToken = async (_req: Request, bearer?: string): Promise<AuthInfo | undefined> => {
  if (!bearer) return undefined

  // Dev/testing bearer token.
  const secret = process.env.MCP_BEARER_TOKEN
  if (secret && bearer === secret) {
    return { token: bearer, clientId: 'afterthought-owner', scopes: ['cms:read'] }
  }

  // WorkOS AuthKit access token (JWT) — accept if any candidate JWKS verifies it.
  // Fail closed: the WorkOS path is only open to explicitly allowlisted users.
  const allowed = (process.env.MCP_ALLOWED_SUBS || '').split(',').map(s => s.trim()).filter(Boolean)
  if (allowed.length === 0) {
    console.error('[MCP auth] MCP_ALLOWED_SUBS is empty — WorkOS auth disabled (fail-closed).')
    return undefined
  }
  const list = await getJwksList()
  for (const jwks of list) {
    try {
      const { payload } = await jwtVerify(bearer, jwks)
      // Lock down to specific WorkOS users.
      if (!allowed.includes(String(payload.sub))) {
        console.error('[MCP auth] user not allowed:', payload.sub)
        return undefined
      }
      return {
        token: bearer,
        clientId: String(payload.azp ?? payload.client_id ?? payload.sub ?? 'workos'),
        scopes: ['cms:read', 'cms:write'],
        extra: { sub: String(payload.sub ?? '') },
      }
    } catch { /* try next */ }
  }

  // Diagnostics for Vercel logs if nothing verified.
  try {
    const hdr = decodeProtectedHeader(bearer)
    const pl = decodeJwt(bearer)
    console.error('[MCP auth] no JWKS verified token.',
      'alg:', hdr.alg, 'kid:', hdr.kid, '| iss:', pl.iss, 'aud:', pl.aud, 'sub:', pl.sub,
      '| jwks tried:', list.length)
  } catch {
    console.error('[MCP auth] bearer is not a JWT. prefix:', bearer.slice(0, 16))
  }
  return undefined
}

const authed = withMcpAuth(handler, verifyToken, { required: true })

export { authed as GET, authed as POST, authed as DELETE }
