import type { Routine } from '@/lib/types'

export function RoutineForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void
  defaults?: Pick<Routine, 'title' | 'description'>
  submitLabel: string
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

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}