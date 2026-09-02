import Link from 'next/link'
import { listRoutines, listRoutinesForPlayer } from '@/lib/db/routines'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'
import { PageHeader } from '@/components/page-header'
import { RoutineAssignmentBadge } from '@/components/routine-assignment-badge'
import { IconPlus } from '@/components/icons'

export default async function RutinasPage() {
  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

  const routines = staff
    ? await listRoutines()
    : await listRoutinesForPlayer(profile?.id ?? '')

  return (
    <div>
      <PageHeader title="Rutinas">
        {staff ? (
          <Link href="/rutinas/new" className="btn btn-primary">
            <IconPlus size={16} />
            Nueva rutina
          </Link>
        ) : null}
      </PageHeader>

      {routines.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">
          {staff ? 'No hay rutinas todavía' : 'No tienes rutinas asignadas'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/rutinas/${routine.id}`}
              className="rounded-xl border border-seam bg-cabinet p-5 transition-colors hover:border-seam-bright"
            >
              <h2 className="readout text-lg">{routine.title}</h2>
              {routine.description ? (
                <p className="mt-1 truncate text-sm text-lit/55">{routine.description}</p>
              ) : null}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-lit/45">
                  {routine.exercise_count} {routine.exercise_count === 1 ? 'ejercicio' : 'ejercicios'}
                </p>
                {!staff ? (
                  <RoutineAssignmentBadge
                    assignedToPlayer={routine.assigned_to_player}
                    assignedToGroup={routine.assigned_to_group}
                  />
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}