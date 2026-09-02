'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import {
  addExercise as dbAddExercise,
  createRoutine as dbCreateRoutine,
  deleteExercise as dbDeleteExercise,
  deleteRoutine as dbDeleteRoutine,
  updateExercise as dbUpdateExercise,
  updateRoutine as dbUpdateRoutine,
} from '@/lib/db/routines'
import type { Role } from '@/lib/types'

function assertStaff(role: Role | null | undefined) {
  if (!isStaff(role)) throw new Error('No tienes permisos')
}

function parseExercise(formData: FormData) {
  const setsRaw = formData.get('sets')
  const sets = setsRaw && String(setsRaw) !== '' ? Number(setsRaw) : null
  return {
    name: String(formData.get('name')),
    sets,
    reps: String(formData.get('reps') ?? ''),
    notes: String(formData.get('notes') ?? ''),
  }
}

export async function createRoutine(formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const title = String(formData.get('title'))
  if (!title) throw new Error('El título es obligatorio')

  const assignmentType = formData.get('assignment_type') as string | null
  const assignedToPlayer = assignmentType === 'player'
    ? (String(formData.get('assigned_to_player')) || null)
    : null
  const assignedToGroup = assignmentType === 'group'
    ? (String(formData.get('assigned_to_group')) || null)
    : null

  await dbCreateRoutine({
    title,
    description: String(formData.get('description') ?? ''),
    assigned_to_player: assignedToPlayer,
    assigned_to_group: assignedToGroup,
  })
  revalidatePath('/rutinas')
  redirect('/rutinas')
}

export async function updateRoutine(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const assignmentType = formData.get('assignment_type') as string | null
  const assignedToPlayer = assignmentType === 'player'
    ? (String(formData.get('assigned_to_player')) || null)
    : null
  const assignedToGroup = assignmentType === 'group'
    ? (String(formData.get('assigned_to_group')) || null)
    : null

  await dbUpdateRoutine(id, {
    title: String(formData.get('title')),
    description: String(formData.get('description') ?? ''),
    assigned_to_player: assignedToPlayer,
    assigned_to_group: assignedToGroup,
  })
  revalidatePath('/rutinas')
  revalidatePath(`/rutinas/${id}`)
  redirect(`/rutinas/${id}`)
}

export async function deleteRoutine(id: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbDeleteRoutine(id)
  revalidatePath('/rutinas')
  redirect('/rutinas')
}

export async function addExercise(routineId: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const input = parseExercise(formData)
  if (!input.name) throw new Error('El nombre del ejercicio es obligatorio')
  await dbAddExercise(routineId, input)
  revalidatePath('/rutinas')
}

export async function updateExercise(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbUpdateExercise(id, parseExercise(formData))
  revalidatePath('/rutinas')
}

export async function deleteExercise(id: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbDeleteExercise(id)
  revalidatePath('/rutinas')
}