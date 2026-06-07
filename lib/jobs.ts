import { supabase } from './supabase'

export interface Job {
  id: string
  title: string
  slug: string
  type: string
  location: string
  summary: string
  description: string
  what_youll_do: string[]
  looking_for: string[]
  nice_to_have: string
  why_afterthought: string
  status: 'open' | 'closed'
  application_form_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type JobInput = Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>

export async function getOpenJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Job[]
}

export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Job[]
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as Job
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Job
}

export async function createJob(input: JobInput): Promise<Job> {
  const { data, error } = await supabase.from('jobs').insert(input).select().single()
  if (error) throw error
  return data as Job
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  const { data, error } = await supabase.from('jobs').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Job
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  if (error) throw error
}

export async function countJobs(): Promise<number> {
  const { count, error } = await supabase.from('jobs').select('id', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}
