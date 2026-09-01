'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { createEvent as dbCreateEvent, deleteEvent as dbDeleteEvent, updateEvent as dbUpdateEvent } from '@/lib/db/events'
import { currentProfile } from '@/lib/db/users'
import type { EventFormInput, EventType, Role } from '@/lib/types'

function assertStaff(role: Role | null | undefined) {
  if (!isStaff(role)) throw new Error('No tienes permisos')
}

export async function createEvent(formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const input: EventFormInput = {
    title: String(formData.get('title')),
    event_type: formData.get('event_type') as EventType,
    starts_at: String(formData.get('starts_at')),
    location: String(formData.get('location') ?? ''),
    description: String(formData.get('description') ?? ''),
  }
  if (!input.title || !input.event_type || !input.starts_at) {
    throw new Error('Título, tipo y fecha son obligatorios')
  }
  await dbCreateEvent(input)
  revalidatePath('/calendario')
  redirect('/calendario')
}

export async function updateEvent(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const input: EventFormInput = {
    title: String(formData.get('title')),
    event_type: formData.get('event_type') as EventType,
    starts_at: String(formData.get('starts_at')),
    location: String(formData.get('location') ?? ''),
    description: String(formData.get('description') ?? ''),
  }
  await dbUpdateEvent(id, input)
  revalidatePath('/calendario')
  redirect(`/calendario/${id}`)
}

export async function deleteEvent(id: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbDeleteEvent(id)
  revalidatePath('/calendario')
  redirect('/calendario')
}