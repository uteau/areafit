import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getEvent } from '@/lib/db/events'
import { deleteEvent } from '@/actions/events'
import { formatDayLong } from '@/lib/calendar'
import { EVENT_TYPE_LAMP, EVENT_TYPE_LABELS } from '@/lib/event-labels'
import { ConfirmDelete } from '@/components/confirm-delete'
import { BackLink } from '@/components/back-link'
import { IconPin } from '@/components/icons'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [event, profile] = await Promise.all([getEvent(id), currentProfile()])
  if (!event) notFound()

  const staff = isStaff(profile?.role ?? null)

  const startsAt = new Date(event.starts_at)

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/calendario">Calendario</BackLink>

      <div className="panel p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <span className={`lamp ${EVENT_TYPE_LAMP[event.event_type]}`} />
            <span className={event.event_type === 'partido' ? 'text-lamp' : 'text-lit/70'}>
              {EVENT_TYPE_LABELS[event.event_type]}
            </span>
          </span>
          <span className="h-3 w-px bg-seam" aria-hidden="true" />
          <time className="text-sm font-extrabold tabular-nums text-lit">
            {startsAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
        <h1 className="mt-4 readout text-3xl">{event.title}</h1>
        <p className="mt-2 text-base font-medium capitalize text-lit/60">
          {formatDayLong(startsAt)}
        </p>
        {event.location ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-lit/75">
            <IconPin size={16} className="text-lamp" />
            {event.location}
          </p>
        ) : null}
        {event.description ? (
          <p className="mt-5 whitespace-pre-line border-t border-seam pt-5 text-[15px] leading-relaxed text-lit/80">
            {event.description}
          </p>
        ) : null}
      </div>

      {staff ? (
        <div className="mt-4 flex gap-3">
          <Link
            href={`/calendario/${event.id}/edit`}
            className="btn btn-primary"
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