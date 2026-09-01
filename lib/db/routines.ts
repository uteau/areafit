import { createClient } from '@/lib/supabase/server'
import type { Exercise, Routine } from '@/lib/types'

export async function listRoutines(): Promise<(Routine & { exercise_count: number })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('routines')
    .select('*, exercise_count:routine_exercises(count)')
    .order('created_at', { ascending: false })
  return ((data as unknown) ?? []) as (Routine & { exercise_count: number })[]
}

export async function getRoutine(id: string): Promise<Routine & { exercises: Exercise[] } | null> {
  const supabase = await createClient()
  const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single()
  if (!routine) return null
  const { data: exercises } = await supabase
    .from('routine_exercises')
    .select('*')
    .eq('routine_id', id)
    .order('position', { ascending: true })
  return { ...(routine as Routine), exercises: (exercises as Exercise[]) ?? [] }
}

export async function createRoutine(input: { title: string; description: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('routines').insert({
    ...input,
    created_by: user?.id ?? null,
  })
  if (error) throw new Error('No se pudo crear la rutina')
}

export async function updateRoutine(id: string, input: { title: string; description: string }) {
  const supabase = await createClient()
  const { error } = await supabase.from('routines').update(input).eq('id', id)
  if (error) throw new Error('No se pudo actualizar la rutina')
}

export async function deleteRoutine(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('routines').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar la rutina')
}

export async function addExercise(
  routineId: string,
  input: { name: string; sets: number | null; reps: string; notes: string }
) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('routine_exercises')
    .select('position')
    .eq('routine_id', routineId)
    .order('position', { ascending: false })
    .limit(1)
  const nextPosition = existing?.[0]?.position != null ? existing[0].position + 1 : 0
  const { error } = await supabase.from('routine_exercises').insert({ ...input, routine_id: routineId, position: nextPosition })
  if (error) throw new Error('No se pudo añadir el ejercicio')
}

export async function updateExercise(id: string, input: { name: string; sets: number | null; reps: string; notes: string }) {
  const supabase = await createClient()
  const { error } = await supabase.from('routine_exercises').update(input).eq('id', id)
  if (error) throw new Error('No se pudo actualizar el ejercicio')
}

export async function deleteExercise(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('routine_exercises').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar el ejercicio')
}

export async function reorderExercises(routineId: string, orderedIds: string[]) {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) => ({ id, position: index }))
  const { error } = await supabase.from('routine_exercises').upsert(updates.map((u) => ({ ...u, routine_id: routineId })))
  if (error) throw new Error('No se pudo reordenar los ejercicios')
}