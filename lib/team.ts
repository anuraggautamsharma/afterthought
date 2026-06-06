import { supabase } from './supabase'

export interface TeamMember {
  id: string
  name: string
  role: string
  initials: string
  bio: string            // paragraphs separated by a blank line
  photo: string | null
  accent_color: string   // background behind initials when no photo
  email: string
  arena_url: string
  linkedin_url: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type TeamInput = Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>

export async function getTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as TeamMember[]
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const { data, error } = await supabase.from('team').select('*').eq('id', id).single()
  if (error) return null
  return data as TeamMember
}

export async function createTeamMember(input: TeamInput): Promise<TeamMember> {
  const { data, error } = await supabase.from('team').insert(input).select().single()
  if (error) throw error
  return data as TeamMember
}

export async function updateTeamMember(id: string, input: TeamInput): Promise<TeamMember> {
  const { data, error } = await supabase.from('team').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as TeamMember
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from('team').delete().eq('id', id)
  if (error) throw error
}

export async function countTeam(): Promise<number> {
  const { count, error } = await supabase.from('team').select('id', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}
