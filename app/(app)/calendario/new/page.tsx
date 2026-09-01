import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createEvent } from '@/actions/events'
import { EventForm } from '@/components/event-form'

export default async function NewEventPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo evento</h1>
      <EventForm action={createEvent} submitLabel="Crear evento" />
    </div>
  )
}