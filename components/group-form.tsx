import type { PlayerGroup } from '@/lib/types'

export function GroupForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void
  defaults?: Pick<PlayerGroup, 'name' | 'description'>
  submitLabel: string
}) {
  return (
    <form action={action} className="panel max-w-lg space-y-4 p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Nombre</span>
        <input name="name" required defaultValue={defaults?.name ?? ''} className="field" />
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
