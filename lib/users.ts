import { supabase } from './supabase'
import { hash } from 'bcryptjs'

export type UserRole = 'admin' | 'editor'

export interface CmsUser {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}

const PUBLIC_COLS = 'id, email, name, role, created_at, updated_at'

export async function getUsers(): Promise<CmsUser[]> {
  const { data, error } = await supabase
    .from('cms_users')
    .select(PUBLIC_COLS)
    .order('created_at', { ascending: true })
  if (error) { console.error('[getUsers]', error.message); return [] }
  return (data ?? []) as CmsUser[]
}

export async function countUsers(): Promise<number> {
  const { count, error } = await supabase
    .from('cms_users')
    .select('id', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}

/** For login only — returns the password hash. */
export async function getUserAuthByEmail(email: string): Promise<{ id: string; email: string; password_hash: string } | null> {
  const { data, error } = await supabase
    .from('cms_users')
    .select('id, email, password_hash')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle()
  if (error) { console.error('[getUserAuthByEmail]', error.message); return null }
  return data as { id: string; email: string; password_hash: string } | null
}

export async function getUserById(id: string): Promise<CmsUser | null> {
  const { data } = await supabase.from('cms_users').select(PUBLIC_COLS).eq('id', id).maybeSingle()
  return data as CmsUser | null
}

export interface CreateUserInput {
  email: string
  name?: string
  role?: UserRole
  password: string
}

export async function createUser(input: CreateUserInput): Promise<CmsUser> {
  const password_hash = await hash(input.password, 10)
  const { data, error } = await supabase
    .from('cms_users')
    .insert({
      email: input.email.trim().toLowerCase(),
      name: input.name ?? '',
      role: input.role ?? 'admin',
      password_hash,
    })
    .select(PUBLIC_COLS)
    .single()
  if (error) throw error
  return data as CmsUser
}

export async function updateUser(id: string, input: { name?: string; role?: UserRole }): Promise<void> {
  const { error } = await supabase
    .from('cms_users')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function setUserPassword(id: string, password: string): Promise<void> {
  const password_hash = await hash(password, 10)
  const { error } = await supabase
    .from('cms_users')
    .update({ password_hash, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('cms_users').delete().eq('id', id)
  if (error) throw error
}
