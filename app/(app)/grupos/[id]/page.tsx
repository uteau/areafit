import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { getGroup } from '@/lib/db/groups'
import { deleteGroup } from '@/actions/groups'
import { GroupMemberManager } from '@/components/group-member-manager'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [group, profile, allProfiles] = await Promise.all([
    getGroup(id),
    currentProfile(),
    listProfiles(),
  ])
  if (!group) notFound()

  const staff = isStaff(profile?.role ?? null)
  const allPlayers = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/grupos">Grupos</BackLink>

      <div className="panel p-6 sm:p-8">
        <h1 className="readout text-3xl">{group.name}</h1>
        {group.description ? (
          <p className="mt-5 whitespace-pre-line border-t border-seam pt-5 text-[15px] leading-relaxed text-lit/80">
            {group.description}
          </p>
        ) : null}
      </div>

      {staff ? (
        <div className="mt-6">
          <GroupMemberManager
            groupId={id}
            members={group.members}
            allPlayers={allPlayers}
          />
        </div>
      ) : null}

      {staff ? (
        <div className="mt-6 flex gap-3">
          <Link href={`/grupos/${group.id}/edit`} className="btn btn-primary">
            Editar
          </Link>
          <ConfirmDelete
            action={deleteGroup.bind(null, group.id)}
            message="¿Eliminar este grupo y su membresía?"
          />
        </div>
      ) : null}
    </div>
  )
}