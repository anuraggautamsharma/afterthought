# Afterthought CMS — MCP server

Lets you read and manage the CMS from Claude. It's a normal route in this Next.js
app (`app/api/[transport]/route.ts`), so it deploys to Vercel with everything else
and reuses the same Supabase access — no separate service to run.

Endpoint (once deployed): `https://www.afterthought.design/api/mcp`

## The design — it auto-extends as the CMS grows

The tools are **generic and registry-driven**. `lib/mcp/registry.ts` lists each
content collection (posts, jobs, forms, work, services, team) with its read
functions. The MCP server exposes generic tools — `list_collections`,
`list_records`, `get_record` — that operate over *whatever is registered*.

**So when you add a new feature to the CMS, you expose it to Claude by adding one
line to the registry.** No new MCP code. Example:

```ts
{ name: 'testimonials', label: 'Testimonials', description: 'Client quotes',
  list: getAllTestimonials, get: getTestimonialById },
```

…and `list_records({ collection: "testimonials" })` works immediately in Claude.

## Tools (Phase 1 — read only)

| Tool | What it does |
|---|---|
| `list_collections` | Discover what content exists |
| `list_records` | List any collection (posts, jobs, work, …) |
| `get_record` | Get one record by id |
| `list_responses` | Form responses, filterable by form / unread / last-N-days |
| `get_response` | One response with all answers (labels resolved, files named) |
| `list_jobs_with_response_counts` | Jobs + how many applications each got |

## Auth

Phase 1 uses a **bearer token**, set as `MCP_BEARER_TOKEN` in Vercel env. The
endpoint is **fail-closed**: if the variable is unset, every request is rejected,
so nothing is ever exposed by accident.

Generate a strong token and add it in Vercel → Settings → Environment Variables:

```
MCP_BEARER_TOKEN = <a long random string>
```

## Test it now (before mobile/web)

With [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```
npx @modelcontextprotocol/inspector
```

Connect to `https://www.afterthought.design/api/mcp` (Streamable HTTP), add an
`Authorization: Bearer <your token>` header, and call the tools.

Claude Desktop / Claude Code can also connect with that header.

## Phase 2 (next)

1. **Writes** — `create_record` / `update_record` (draft posts, edit jobs, etc.)
   behind the same registry pattern.
2. **OAuth** — claude.ai **web + mobile** connectors require OAuth 2.1, so to use
   this from your phone we swap the bearer check for a managed OAuth provider
   (WorkOS AuthKit / Stytch / Scalekit, free tier). The tools above stay exactly
   the same; only the auth wrapper changes.
