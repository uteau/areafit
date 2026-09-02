import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { getGroup } from '@/lib/db/groups'
import { deleteRoutine } from '@/actions/routines'
import { ExerciseList } from '@/components/exercise-list'
import { RoutineAssignmentBadge } from '@/components/routine-assignment-badge'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [routine, profile] = await Promise.all([getRoutine(id), currentProfile()])
  if (!routine) notFound()

  const staff = isStaff(profile?.role ?? null)

  let playerMap: Map<string, string> | undefined
  let groupMap: Map<string, string> | undefined

  if (routine.assigned_to_player) {
    const profiles = await listProfiles()
    playerMap = new Map(profiles.map((p) => [p.id, p.full_name]))
  }
  if (routine.assigned_to_group) {
    const group = await getGroup(routine.assigned_to_group)
    groupMap = group ? new Map([[group.id, group.name]]) : undefined
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/rutinas">Rutinas</BackLink>

      <div className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="readout text-3xl">{routine.title}</h1>
          <RoutineAssignmentBadge
            assignedToPlayer={routine.assigned_to_player}
            assignedToGroup={routine.assigned_to_group}
            playerMap={playerMap}
            groupMap={groupMap}
          />
        </div>
        {routine.description ? (
          <p className="mt-5 whitespace-pre-line border-t border-seam pt-5 text-[15px] leading-relaxed text-lit/80">
            {routine.description}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <ExerciseList exercises={routine.exercises} />
      </div>

      {staff ? (
        <div className="mt-6 flex gap-3">
          <Link href={`/rutinas/${routine.id}/edit`} className="btn btn-primary">
            Editar
          </Link>
          <ConfirmDelete
            action={deleteRoutine.bind(null, routine.id)}
            message="¿Eliminar esta rutina y sus ejercicios?"
          />
        </div>
      ) : null}
    </div>
  )
}