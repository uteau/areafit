import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createGroup } from '@/actions/groups'
import { GroupForm } from '@/components/group-form'
import { BackLink } from '@/components/back-link'

export default async function NewGroupPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/grupos">Grupos</BackLink>
      <h1 className="mb-6 readout text-3xl">Nuevo grupo</h1>
      <GroupForm action={createGroup} submitLabel="Crear grupo" />
    </div>
  )
}