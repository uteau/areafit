'use server'

import { revalidatePath } from 'next/cache'
import { ROLES, isStaff } from '@/lib/access'
import {
  createAccount,
  currentProfile,
  deactivateUser,
  updateUserRole,
} from '@/lib/db/users'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Role } from '@/lib/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function guardStaff(): Promise<{ error?: string } | null> {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) return { error: 'No tienes permisos' }
  return null
}

export async function createUserAccount(formData: FormData): Promise<{ error?: string }> {
  const denied = await guardStaff()
  if (denied) return denied

  const fullName = String(formData.get('full_name')).trim()
  const email = String(formData.get('email')).trim()
  const password = String(formData.get('password'))
  const role = formData.get('role') as Role

  if (!fullName || !email || !password || !ROLES.includes(role)) {
    return { error: 'Todos los campos son obligatorios' }
  }
  if (!EMAIL_RE.test(email)) return { error: 'El correo no es válido' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres' }

  try {
    await createAccount({ email, password, fullName, role })
  } catch (e) {
    return { error: (e as Error).message }
  }
  revalidatePath('/usuarios')
  return {}
}

export async function changeUserRole(id: string, formData: FormData): Promise<{ error?: string }> {
  const denied = await guardStaff()
  if (denied) return denied

  const role = formData.get('role') as Role
  if (!ROLES.includes(role)) return { error: 'Rol no válido' }

  try {
    const admin = createAdminClient()
    const { data: target } = await admin.from('profiles').select('role').eq('id', id).single()
    if (target && target.role === 'admin' && role !== 'admin') {
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
      if ((count ?? 0) <= 1) return { error: 'Debe existir al menos un administrador' }
    }
    await updateUserRole(id, role)
  } catch (e) {
    return { error: (e as Error).message }
  }
  revalidatePath('/usuarios')
  return {}
}

export async function removeUser(id: string): Promise<{ error?: string }> {
  const denied = await guardStaff()
  if (denied) return denied

  try {
    await deactivateUser(id)
    await createAdminClient().from('profiles').delete().eq('id', id)
  } catch (e) {
    return { error: (e as Error).message }
  }
  revalidatePath('/usuarios')
  return {}
}