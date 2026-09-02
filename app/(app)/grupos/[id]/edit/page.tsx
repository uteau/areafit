import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getGroup } from '@/lib/db/groups'
import { updateGroup } from '@/actions/groups'
import { GroupForm } from '@/components/group-form'
import { BackLink } from '@/components/back-link'

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const group = await getGroup(id)
  if (!group) notFound()

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href={`/grupos/${id}`}>{group.name}</BackLink>
      <h1 className="mb-6 readout text-3xl">Editar grupo</h1>
      <GroupForm
        action={async (fd) => updateGroup(id, fd)}
        defaults={group}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}