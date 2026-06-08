import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { jwtVerify, createRemoteJWKSet, decodeProtectedHeader, decodeJwt } from 'jose'
import { z } from 'zod'
import { COLLECTIONS, getCollection } from '@/lib/mcp/registry'
import { getSubmissions, getSubmissionById, type Submission } from '@/lib/submissions'
import {
  getAllForms, getFields, formatAnswerForDisplay, asStoredFiles,
  FORM_CATEGORY_LABELS, type FormCategory, type Form,
} from '@/lib/forms'
import { getAllJobs } from '@/lib/jobs'

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
  const list = await getJwksList()
  for (const jwks of list) {
    try {
      const { payload } = await jwtVerify(bearer, jwks)
      return {
        token: bearer,
        clientId: String(payload.azp ?? payload.client_id ?? payload.sub ?? 'workos'),
        scopes: ['cms:read'],
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
