import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { updateRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { ExerciseEditor } from '@/components/exercise-editor'
import { BackLink } from '@/components/back-link'
import { PageHeader } from '@/components/page-header'

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const routine = await getRoutine(id)
  if (!routine) notFound()

  return (
    <div className="max-w-2xl">
      <BackLink href={`/rutinas/${id}`}>{routine.title}</BackLink>
      <PageHeader title="Editar rutina" />
      <RoutineForm
        action={async (fd) => updateRoutine(id, fd)}
        defaults={routine}
        submitLabel="Guardar cambios"
      />
      <ExerciseEditor routineId={id} exercises={routine.exercises} />
    </div>
  )
}