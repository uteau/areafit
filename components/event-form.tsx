import type { EventRow } from '@/lib/types'
import { EVENT_TYPE_LABELS } from '@/lib/event-labels'

const TYPES = ['partido', 'entrenamiento', 'evento'] as const

function toLocalInput(iso: string) {
  const d = new Date(iso)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function nowLocalInput() {
  return toLocalInput(new Date().toISOString())
}

export function EventForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void
  defaults?: EventRow
  submitLabel: string
}) {
  return (
    <form action={action} className="panel max-w-lg space-y-4 p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Título</span>
        <input name="title" required defaultValue={defaults?.title} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Tipo</span>
        <select
          name="event_type"
          defaultValue={defaults?.event_type ?? 'entrenamiento'}
          className="field"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Fecha y hora</span>
        <input
          name="starts_at"
          type="datetime-local"
          required
          defaultValue={defaults ? toLocalInput(defaults.starts_at) : nowLocalInput()}
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Lugar</span>
        <input name="location" defaultValue={defaults?.location ?? ''} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Descripción</span>
        <textarea
          name="description"
          rows={4}
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