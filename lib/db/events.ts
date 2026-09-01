import { createClient } from '@/lib/supabase/server'
import type { EventFormInput, EventRow } from '@/lib/types'

export async function listEvents(): Promise<EventRow[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: true })
  return (data as EventRow[]) ?? []
}

export async function getEvent(id: string): Promise<EventRow | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).single()
  return (data as EventRow) ?? null
}

export async function createEvent(input: EventFormInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('events').insert({
    ...input,
    starts_at: new Date(input.starts_at).toISOString(),
    created_by: user?.id ?? null,
  })
  if (error) throw new Error('No se pudo crear el evento')
}

export async function updateEvent(id: string, input: EventFormInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .update({ ...input, starts_at: new Date(input.starts_at).toISOString() })
    .eq('id', id)
  if (error) throw new Error('No se pudo actualizar el evento')
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar el evento')
}