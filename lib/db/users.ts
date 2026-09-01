import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Role } from '@/lib/types'

export async function listProfiles(): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').order('role', { ascending: true })
  return (data as Profile[]) ?? []
}

export async function createAccount(input: {
  email: string
  password: string
  fullName: string
  role: Exclude<Role, 'deportista'> | 'deportista'
}) {
  const admin = createAdminClient()
  const { data: { user }, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  })
  if (error || !user) throw new Error('No se pudo crear la cuenta')
  const { error: profileError } = await createAdminClient()
    .from('profiles')
    .insert({ id: user.id, full_name: input.fullName, role: input.role })
  if (profileError) throw new Error('No se pudo crear el perfil')
}

export async function updateUserRole(id: string, role: Role) {
  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ role }).eq('id', id)
  if (error) throw new Error('No se pudo cambiar el rol')
}

export async function deactivateUser(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: '876000h' })
  if (error) throw new Error('No se pudo desactivar el usuario')
}