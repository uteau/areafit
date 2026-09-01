import type { Exercise } from '@/lib/types'
import {
  addExercise,
  deleteExercise,
  updateExercise,
} from '@/actions/routines'
import { ConfirmDelete } from '@/components/confirm-delete'

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

function Fields({ defaultValue }: { defaultValue?: Exercise }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Nombre</span>
          <input
            name="name"
            required
            defaultValue={defaultValue?.name ?? ''}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Series</span>
          <input
            name="sets"
            type="number"
            min={1}
            defaultValue={defaultValue?.sets ?? ''}
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Reps</span>
        <input
          name="reps"
          defaultValue={defaultValue?.reps ?? ''}
          placeholder="10-12, 2 min, hasta fallo…"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Notas</span>
        <textarea
          name="notes"
          rows={2}
          defaultValue={defaultValue?.notes ?? ''}
          className={inputClass}
        />
      </label>
    </>
  )
}

export function ExerciseEditor({
  routineId,
  exercises,
}: {
  routineId: string
  exercises: Exercise[]
}) {
  return (
    <div className="mt-8 max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Ejercicios</h2>

      {exercises.map((ex) => (
        <form
          key={ex.id}
          action={updateExercise.bind(null, ex.id)}
          className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <Fields defaultValue={ex} />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Guardar
            </button>
            <ConfirmDelete
              action={deleteExercise.bind(null, ex.id)}
              message="¿Eliminar este ejercicio?"
            />
          </div>
        </form>
      ))}

      <form
        action={addExercise.bind(null, routineId)}
        className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-white p-4"
      >
        <p className="text-sm font-medium text-slate-700">Añadir ejercicio</p>
        <Fields />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          Añadir ejercicio
        </button>
      </form>
    </div>
  )
}