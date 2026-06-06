import { supabase } from './supabase'

export type SubmissionType = 'contact' | 'newsletter' | 'application' | 'freelance'

export interface Submission {
  id: string
  type: SubmissionType
  name: string
  email: string
  subject: string
  message: string
  data: Record<string, unknown>
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
    })
    .select()
    .single()
  if (error) throw error
  return data as Submission
}

export async function getSubmissions(opts: { archived?: boolean } = {}): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('is_archived', opts.archived ?? false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Submission[]
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
