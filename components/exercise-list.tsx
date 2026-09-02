import type { Exercise } from '@/lib/types'

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (exercises.length === 0) {
    return <p className="text-sm font-medium text-lit/45">Esta rutina aún no tiene ejercicios</p>
  }

  return (
    <ol className="space-y-3">
      {exercises.map((ex, i) => (
        <li key={ex.id} className="panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-bold text-lit">
              <span className="lamp lamp-partido" aria-hidden="true" />
              {i + 1}. {ex.name}
            </span>
            <span className="text-sm font-semibold tabular-nums text-lit/60">
              {ex.sets ? `${ex.sets} series` : ''}
              {ex.sets && ex.reps ? ' × ' : ''}
              {ex.reps}
            </span>
          </div>
          {ex.notes ? <p className="mt-1.5 text-sm text-lit/55">{ex.notes}</p> : null}
        </li>
      ))}
    </ol>
  )
}