import Link from 'next/link'
import { listRoutines } from '@/lib/db/routines'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'
import { PageHeader } from '@/components/page-header'
import { IconPlus } from '@/components/icons'

export default async function RutinasPage() {
  const routines = await listRoutines()
  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

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
        <p className="text-sm font-medium text-lit/45">No hay rutinas todavía</p>
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
              <p className="mt-3 text-xs font-semibold text-lit/45">
                {routine.exercise_count} {routine.exercise_count === 1 ? 'ejercicio' : 'ejercicios'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}