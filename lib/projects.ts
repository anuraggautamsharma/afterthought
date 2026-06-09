import { supabase } from './supabase'

export interface Project {
  id: string
  title: string            // may contain *emphasis* markers
  slug: string
  client: string
  scope: string
  year: string
  credit_label: string     // e.g. "Lead" or "Studio"
  credit_value: string     // e.g. "Afterthought"
  case_label: string       // e.g. "Case 001"
  hero_color: string       // CSS colour used when there is no cover image
  cover_image: string | null
  summary: string          // short line for the work index tile + meta description fallback
  content: object          // Tiptap JSON body
  status: 'draft' | 'published'
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export type ProjectInput = Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Project[]
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) { console.error('[getAllProjects]', error.message); return [] }
  return (data ?? []) as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
  if (error) return null
  return data as Project
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) return null
  return data as Project
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase.from('projects').insert(input).select().single()
  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase.from('projects').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function countProjects(): Promise<number> {
  const { count, error } = await supabase.from('projects').select('id', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}

/** Render a title containing *emphasis* markers into plain text (for SEO/alt). */
export function stripEmphasis(title: string): string {
  return title.replace(/\*/g, '')
}
