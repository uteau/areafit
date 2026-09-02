import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { getEvent } from '@/lib/db/events'
import { updateEvent } from '@/actions/events'
import { EventForm } from '@/components/event-form'
import { BackLink } from '@/components/back-link'
import { notFound } from 'next/navigation'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const event = await getEvent(id)
  if (!event) notFound()

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href={`/calendario/${id}`}>
        {event.title}
      </BackLink>
      <h1 className="mb-6 readout text-3xl">Editar evento</h1>
      <EventForm
        action={async (fd) => updateEvent(id, fd)}
        defaults={event}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}