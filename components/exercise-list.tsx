import type { Exercise } from '@/lib/types'

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (exercises.length === 0) {
    return <p className="text-sm text-slate-500">Esta rutina aún no tiene ejercicios</p>
  }

  return (
    <ol className="space-y-3">
      {exercises.map((ex, i) => (
        <li key={ex.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-medium text-slate-900">
              {i + 1}. {ex.name}
            </span>
            <span className="text-sm text-slate-600">
              {ex.sets ? `${ex.sets} series` : ''}
              {ex.sets && ex.reps ? ' × ' : ''}
              {ex.reps}
            </span>
          </div>
          {ex.notes ? <p className="mt-1 text-sm text-slate-500">{ex.notes}</p> : null}
        </li>
      ))}
    </ol>
  )
}