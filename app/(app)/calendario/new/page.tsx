import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createEvent } from '@/actions/events'
import { EventForm } from '@/components/event-form'
import { PageHeader } from '@/components/page-header'

export default async function NewEventPage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div>
      <PageHeader title="Nuevo evento" />
      <EventForm action={createEvent} submitLabel="Crear evento" />
    </div>
  )
}