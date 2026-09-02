import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { listGroups } from '@/lib/db/groups'
import { getRoutine } from '@/lib/db/routines'
import { updateRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { ExerciseEditor } from '@/components/exercise-editor'
import { BackLink } from '@/components/back-link'

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const [routine, allProfiles, groups] = await Promise.all([
    getRoutine(id),
    listProfiles(),
    listGroups(),
  ])
  if (!routine) notFound()

  const players = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/rutinas/${id}`}>{routine.title}</BackLink>
      <h1 className="mb-6 readout text-3xl">Editar rutina</h1>
      <RoutineForm
        action={async (fd) => updateRoutine(id, fd)}
        defaults={routine}
        submitLabel="Guardar cambios"
        players={players}
        groups={groups}
      />
      <ExerciseEditor routineId={id} exercises={routine.exercises} />
    </div>
  )
}