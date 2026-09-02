import type { PlayerGroup, Profile, Routine } from '@/lib/types'
import { RoutineAssignmentSelect } from '@/components/routine-assignment-select'

export function RoutineForm({
  action,
  defaults,
  submitLabel,
  players,
  groups,
}: {
  action: (formData: FormData) => void
  defaults?: Pick<Routine, 'title' | 'description' | 'assigned_to_player' | 'assigned_to_group'>
  submitLabel: string
  players?: Profile[]
  groups?: PlayerGroup[]
}) {
  return (
    <form action={action} className="panel max-w-lg space-y-4 p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Título</span>
        <input name="title" required defaultValue={defaults?.title ?? ''} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Descripción</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ''}
          className="field"
        />
      </label>

      {players && groups ? (
        <RoutineAssignmentSelect
          players={players}
          groups={groups}
          defaults={
            defaults
              ? {
                  assigned_to_player: defaults.assigned_to_player ?? null,
                  assigned_to_group: defaults.assigned_to_group ?? null,
                }
              : undefined
          }
        />
      ) : null}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}