import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getEvent } from '@/lib/db/events'
import { deleteEvent } from '@/actions/events'
import { formatDayLong } from '@/lib/calendar'
import { EVENT_TYPE_BADGE, EVENT_TYPE_LABELS } from '@/lib/event-labels'
import { ConfirmDelete } from '@/components/confirm-delete'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  const profile = await currentProfile()
  const staff = isStaff(profile?.role ?? null)

  const startsAt = new Date(event.starts_at)

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/calendario" className="text-sm text-blue-600 hover:underline">
          ← Calendario
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${EVENT_TYPE_BADGE[event.event_type]}`}
          >
            {EVENT_TYPE_LABELS[event.event_type]}
          </span>
          <time className="text-sm font-medium text-slate-700">
            {startsAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{event.title}</h1>
        <p className="mt-1 capitalize text-slate-500">{formatDayLong(startsAt)}</p>
        {event.location ? <p className="mt-2 text-sm text-slate-600">📍 {event.location}</p> : null}
        {event.description ? <p className="mt-4 whitespace-pre-line text-slate-700">{event.description}</p> : null}
      </div>

      {staff ? (
        <div className="mt-4 flex gap-3">
          <Link
            href={`/calendario/${event.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Editar
          </Link>
          <ConfirmDelete
            action={deleteEvent.bind(null, event.id)}
            message="¿Eliminar este evento?"
          />
        </div>
      ) : null}
    </div>
  )
}