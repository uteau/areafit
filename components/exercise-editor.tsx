import type { Exercise } from '@/lib/types'
import {
  addExercise,
  deleteExercise,
  updateExercise,
} from '@/actions/routines'
import { ConfirmDelete } from '@/components/confirm-delete'

function Fields({ defaultValue }: { defaultValue?: Exercise }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Nombre</span>
          <input
            name="name"
            required
            defaultValue={defaultValue?.name ?? ''}
            className="field"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Series</span>
          <input
            name="sets"
            type="number"
            min={1}
            defaultValue={defaultValue?.sets ?? ''}
            className="field"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Reps</span>
        <input
          name="reps"
          defaultValue={defaultValue?.reps ?? ''}
          placeholder="10-12, 2 min, hasta fallo…"
          className="field"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Notas</span>
        <textarea
          name="notes"
          rows={2}
          defaultValue={defaultValue?.notes ?? ''}
          className="field"
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
    <div className="mt-8 space-y-4">
      <h2 className="readout text-xl">Ejercicios</h2>

      {exercises.map((ex) => (
        <form
          key={ex.id}
          action={updateExercise.bind(null, ex.id)}
          className="panel space-y-3 p-4"
        >
          <Fields defaultValue={ex} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
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
        className="space-y-3 rounded-lg border border-dashed border-seam-bright bg-cabinet/60 p-4"
      >
        <p className="text-sm font-bold text-lit/80">Añadir ejercicio</p>
        <Fields />
        <button type="submit" className="btn btn-ghost">
          Añadir ejercicio
        </button>
      </form>
    </div>
  )
}