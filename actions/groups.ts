'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import {
  createGroup as dbCreateGroup,
  updateGroup as dbUpdateGroup,
  deleteGroup as dbDeleteGroup,
  addGroupMember as dbAddGroupMember,
  removeGroupMember as dbRemoveGroupMember,
} from '@/lib/db/groups'
import type { Role } from '@/lib/types'

function assertStaff(role: Role | null | undefined) {
  if (!isStaff(role)) throw new Error('No tienes permisos')
}

export async function createGroup(formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const name = String(formData.get('name')).trim()
  if (!name) throw new Error('El nombre es obligatorio')
  await dbCreateGroup({
    name,
    description: String(formData.get('description') ?? ''),
  })
  revalidatePath('/grupos')
  redirect('/grupos')
}

export async function updateGroup(id: string, formData: FormData) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  const name = String(formData.get('name')).trim()
  if (!name) throw new Error('El nombre es obligatorio')
  await dbUpdateGroup(id, {
    name,
    description: String(formData.get('description') ?? ''),
  })
  revalidatePath('/grupos')
  revalidatePath(`/grupos/${id}`)
  redirect(`/grupos/${id}`)
}

export async function deleteGroup(id: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbDeleteGroup(id)
  revalidatePath('/grupos')
  redirect('/grupos')
}

export async function addGroupMember(groupId: string, playerId: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbAddGroupMember(groupId, playerId)
  revalidatePath(`/grupos/${groupId}`)
}

export async function removeGroupMember(groupId: string, playerId: string) {
  const profile = await currentProfile()
  assertStaff(profile?.role)

  await dbRemoveGroupMember(groupId, playerId)
  revalidatePath(`/grupos/${groupId}`)
}
