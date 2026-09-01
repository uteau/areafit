import Link from 'next/link'
import { listRoutines } from '@/lib/db/routines'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'

export default async function RutinasPage() {
  const routines = await listRoutines()
  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Rutinas</h1>
        {staff ? (
          <Link
            href="/rutinas/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Nueva rutina
          </Link>
        ) : null}
      </div>

      {routines.length === 0 ? (
        <p className="text-sm text-slate-500">No hay rutinas todavía</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/rutinas/${routine.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{routine.title}</h2>
              {routine.description ? (
                <p className="mt-1 truncate text-sm text-slate-500">{routine.description}</p>
              ) : null}
              <p className="mt-3 text-xs text-slate-400">
                {routine.exercise_count} {routine.exercise_count === 1 ? 'ejercicio' : 'ejercicios'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}