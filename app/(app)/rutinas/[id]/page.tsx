import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { deleteRoutine } from '@/actions/routines'
import { ExerciseList } from '@/components/exercise-list'
import { ConfirmDelete } from '@/components/confirm-delete'

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const routine = await getRoutine(id)
  if (!routine) notFound()

  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/rutinas" className="text-sm text-blue-600 hover:underline">
          ← Rutinas
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{routine.title}</h1>
        {routine.description ? (
          <p className="mt-2 whitespace-pre-line text-slate-600">{routine.description}</p>
        ) : null}
      </div>

      <div className="mt-6">
        <ExerciseList exercises={routine.exercises} />
      </div>

      {staff ? (
        <div className="mt-6 flex gap-3">
          <Link
            href={`/rutinas/${routine.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
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