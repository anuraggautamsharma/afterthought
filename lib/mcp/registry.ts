/**
 * MCP collection registry
 * ────────────────────────────────────────────────────────────────────────────
 * One place that maps each CMS "collection" to its data functions. The MCP
 * server exposes GENERIC tools (list_records / get_record / create_record /
 * update_record / delete_record) that operate over whatever is registered here —
 * so adding a new CMS feature to Claude is a ONE-LINE change below.
 */
import { getAllPosts, getPostById, createPost, updatePost, deletePost, type PostInput } from '@/lib/posts'
import { getAllJobs, getJobById, createJob, updateJob, deleteJob, type JobInput } from '@/lib/jobs'
import { getAllForms, getFormById, createForm, updateForm, deleteForm, type FormInput } from '@/lib/forms'
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, type ProjectInput } from '@/lib/projects'
import { getServices, getServiceById, createService, updateService, deleteService, type ServiceInput } from '@/lib/services'
import { getTeam, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember, type TeamInput } from '@/lib/team'

export interface McpCollection {
  name: string
  label: string
  description: string
  list: () => Promise<unknown[]>
  get: (id: string) => Promise<unknown | null>
  create?: (data: Record<string, unknown>) => Promise<unknown>
  update?: (id: string, data: Record<string, unknown>) => Promise<unknown>
  remove?: (id: string) => Promise<void>
}

export const COLLECTIONS: McpCollection[] = [
  { name: 'posts', label: 'Posts', description: 'Blog posts / writing', list: getAllPosts, get: getPostById,
    create: d => createPost(d as PostInput), update: (id, d) => updatePost(id, d as PostInput), remove: deletePost },
  { name: 'jobs', label: 'Jobs', description: 'Open roles on the careers page', list: getAllJobs, get: getJobById,
    create: d => createJob(d as JobInput), update: (id, d) => updateJob(id, d as JobInput), remove: deleteJob },
  { name: 'forms', label: 'Forms', description: 'Builder forms (contact, application, etc.)', list: getAllForms, get: getFormById,
    create: d => createForm(d as FormInput), update: (id, d) => updateForm(id, d as FormInput), remove: deleteForm },
  { name: 'work', label: 'Work', description: 'Portfolio / case-study projects', list: getAllProjects, get: getProjectById,
    create: d => createProject(d as ProjectInput), update: (id, d) => updateProject(id, d as ProjectInput), remove: deleteProject },
  { name: 'services', label: 'Services', description: 'Studio services offered', list: getServices, get: getServiceById,
    create: d => createService(d as ServiceInput), update: (id, d) => updateService(id, d as ServiceInput), remove: deleteService },
  { name: 'team', label: 'Team', description: 'Team members', list: getTeam, get: getTeamMemberById,
    create: d => createTeamMember(d as TeamInput), update: (id, d) => updateTeamMember(id, d as TeamInput), remove: deleteTeamMember },
  // ➕ Add new CMS collections here — they instantly become usable via Claude.
]

export function getCollection(name: string): McpCollection | null {
  return COLLECTIONS.find(c => c.name === name) ?? null
}
