import { supabase } from './supabase'

export interface Service {
  id: string
  num: string
  color: string
  title: string
  tags: string[]
  description: string
  deliverables: string[]
  who_for: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type ServiceInput = Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) { console.error('[getServices]', error.message); return [] }
  return (data ?? []) as Service[]
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
  if (error) return null
  return data as Service
}

export async function createService(input: ServiceInput): Promise<Service> {
  const { data, error } = await supabase.from('services').insert(input).select().single()
  if (error) throw error
  return data as Service
}

export async function updateService(id: string, input: ServiceInput): Promise<Service> {
  const { data, error } = await supabase.from('services').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Service
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

export async function countServices(): Promise<number> {
  const { count, error } = await supabase.from('services').select('id', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}
