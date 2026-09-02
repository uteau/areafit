import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createEvent } from '@/actions/events'
import { EventForm } from '@/components/event-form'
import { BackLink } from '@/components/back-link'

export default async function NewEventPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/calendario">Calendario</BackLink>
      <h1 className="mb-6 readout text-3xl">Nuevo evento</h1>
      <EventForm action={createEvent} submitLabel="Crear evento" />
    </div>
  )
}