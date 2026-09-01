import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile } from '@/lib/db/users'
import { createRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'

export default async function NewRoutinePage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nueva rutina</h1>
      <RoutineForm action={createRoutine} submitLabel="Crear rutina" />
    </div>
  )
}