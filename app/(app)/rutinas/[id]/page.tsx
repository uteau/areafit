import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getRoutine } from '@/lib/db/routines'
import { deleteRoutine } from '@/actions/routines'
import { ExerciseList } from '@/components/exercise-list'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'

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
    <div className="mx-auto max-w-2xl">
      <BackLink href="/rutinas">Rutinas</BackLink>

      <div className="panel p-6 sm:p-8">
        <h1 className="readout text-3xl">{routine.title}</h1>
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