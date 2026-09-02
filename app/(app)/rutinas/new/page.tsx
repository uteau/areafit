import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { PageHeader } from '@/components/page-header'

export default async function NewRoutinePage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div>
      <PageHeader title="Nueva rutina" />
      <RoutineForm action={createRoutine} submitLabel="Crear rutina" />
    </div>
  )
}