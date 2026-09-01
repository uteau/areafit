import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { updateRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { ExerciseEditor } from '@/components/exercise-editor'

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
      <div className="mb-4">
        <Link href={`/rutinas/${id}`} className="text-sm text-blue-600 hover:underline">
          ← {routine.title}
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Editar rutina</h1>
      <RoutineForm
        action={async (fd) => updateRoutine(id, fd)}
        defaults={routine}
        submitLabel="Guardar cambios"
      />
      <ExerciseEditor routineId={id} exercises={routine.exercises} />
    </div>
  )
}