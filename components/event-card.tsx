import Link from 'next/link'
import { formatDayLong } from '@/lib/calendar'
import type { EventRow } from '@/lib/types'
import { EVENT_TYPE_LAMP, EVENT_TYPE_LABELS } from '@/lib/event-labels'
import { IconPin } from '@/components/icons'

export function EventCard({ event }: { event: EventRow }) {
  const startsAt = new Date(event.starts_at)

  return (
    <Link
      href={`/calendario/${event.id}`}
      className="group block rounded-lg border border-seam bg-cabinet p-3.5 transition-colors hover:border-seam-bright"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <span className={`lamp ${EVENT_TYPE_LAMP[event.event_type]}`} />
          <span className={event.event_type === 'partido' ? 'text-lamp' : 'text-lit/70'}>
            {EVENT_TYPE_LABELS[event.event_type]}
          </span>
        </span>
        <time className="text-sm font-extrabold tabular-nums text-lit">
          {startsAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      <p className="mt-2 font-bold text-lit group-hover:text-white">{event.title}</p>
      <p className="mt-0.5 text-xs font-medium text-lit/50">
        {formatDayLong(startsAt)}
      </p>
      {event.location ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-lit/50">
          <IconPin size={13} />
          {event.location}
        </p>
      ) : null}
    </Link>
  )
}