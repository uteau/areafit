import Link from 'next/link'
import { formatDayLong } from '@/lib/calendar'
import type { EventRow } from '@/lib/types'
import { EVENT_TYPE_BADGE, EVENT_TYPE_LABELS } from '@/lib/event-labels'

export function EventCard({ event }: { event: EventRow }) {
  const startsAt = new Date(event.starts_at)

  return (
    <Link
      href={`/calendario/${event.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${EVENT_TYPE_BADGE[event.event_type]}`}
        >
          {EVENT_TYPE_LABELS[event.event_type]}
        </span>
        <time className="text-sm font-medium text-slate-700">
          {startsAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      <p className="mt-2 font-medium text-slate-900">{event.title}</p>
      <p className="mt-1 text-xs text-slate-500">{formatDayLong(startsAt)}</p>
      {event.location ? <p className="mt-1 text-xs text-slate-500">{event.location}</p> : null}
    </Link>
  )
}