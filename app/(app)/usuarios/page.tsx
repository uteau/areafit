import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { createAdminClient } from '@/lib/supabase/admin'
import { UserForm } from '@/components/user-form'
import { UserTable } from '@/components/user-table'

export default async function UsuariosPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const profiles = await listProfiles()
  const admin = createAdminClient()
  const { data } = await admin.auth.admin.listUsers()
  const emailById = new Map((data?.users ?? []).map((u) => [u.id, u.email ?? '']))

  const users = profiles.map((p) => ({ ...p, email: emailById.get(p.id) ?? '' }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Equipo</h1>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <UserForm />
        <UserTable users={users} />
      </div>
    </div>
  )
}