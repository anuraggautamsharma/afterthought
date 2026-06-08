/**
 * MCP collection registry
 * ────────────────────────────────────────────────────────────────────────────
 * The single place that maps a CMS "collection" to its read functions. The MCP
 * server exposes GENERIC tools (list_collections / list_records / get_record)
 * that operate over whatever is registered here — so when you add a new feature
 * to the CMS, you make it available to Claude by adding ONE entry below. No new
 * MCP tool code required.
 *
 * (Write functions — create/update/delete — get added here in Phase 2 behind
 * the same pattern.)
 */
import { getAllPosts, getPostById, createPost, updatePost, type PostInput } from '@/lib/posts'
import { getAllJobs, getJobById, createJob, updateJob, type JobInput } from '@/lib/jobs'
import { getAllForms, getFormById } from '@/lib/forms'
import { getAllProjects, getProjectById } from '@/lib/projects'
import { getServices, getServiceById } from '@/lib/services'
import { getTeam, getTeamMemberById } from '@/lib/team'

export interface McpCollection {
  /** Stable id used as the `collection` argument in tools. */
  name: string
  /** Human label. */
  label: string
  /** What it holds — shown to Claude so it picks the right collection. */
  description: string
  list: () => Promise<unknown[]>
  get: (id: string) => Promise<unknown | null>
  /** Optional writes. Present only for collections that support them. */
  create?: (data: Record<string, unknown>) => Promise<unknown>
  update?: (id: string, data: Record<string, unknown>) => Promise<unknown>
}

export const COLLECTIONS: McpCollection[] = [
  { name: 'posts', label: 'Posts', description: 'Blog posts / writing', list: getAllPosts, get: getPostById,
    create: d => createPost(d as PostInput), update: (id, d) => updatePost(id, d as PostInput) },
  { name: 'jobs', label: 'Jobs', description: 'Open roles on the careers page', list: getAllJobs, get: getJobById,
    create: d => createJob(d as JobInput), update: (id, d) => updateJob(id, d as JobInput) },
  { name: 'forms', label: 'Forms', description: 'Builder forms (contact, application, etc.)', list: getAllForms, get: getFormById },
  { name: 'work', label: 'Work', description: 'Portfolio / case-study projects', list: getAllProjects, get: getProjectById },
  { name: 'services', label: 'Services', description: 'Studio services offered', list: getServices, get: getServiceById },
  { name: 'team', label: 'Team', description: 'Team members', list: getTeam, get: getTeamMemberById },
  // ➕ Add new CMS collections here — they instantly become usable via Claude.
]

export function getCollection(name: string): McpCollection | null {
  return COLLECTIONS.find(c => c.name === name) ?? null
}
