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

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

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
    <form action={action} className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Título</span>
        <input name="title" required defaultValue={defaults?.title} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Tipo</span>
        <select
          name="event_type"
          defaultValue={defaults?.event_type ?? 'entrenamiento'}
          className={inputClass}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Fecha y hora</span>
        <input
          name="starts_at"
          type="datetime-local"
          required
          defaultValue={defaults ? toLocalInput(defaults.starts_at) : nowLocalInput()}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Lugar</span>
        <input name="location" defaultValue={defaults?.location ?? ''} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Descripción</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaults?.description ?? ''}
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  )
}