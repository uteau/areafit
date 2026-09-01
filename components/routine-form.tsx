import type { Routine } from '@/lib/types'

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

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
    <form action={action} className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Título</span>
        <input name="title" required defaultValue={defaults?.title ?? ''} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Descripción</span>
        <textarea
          name="description"
          rows={3}
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