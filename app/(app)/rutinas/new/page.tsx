import { redirect } from 'next/navigation'
import { isStaff } from '@/lib/access'
import { currentProfile, listProfiles } from '@/lib/db/users'
import { listGroups } from '@/lib/db/groups'
import { createRoutine } from '@/actions/routines'
import { RoutineForm } from '@/components/routine-form'
import { BackLink } from '@/components/back-link'

export default async function NewRoutinePage() {
  const profile = await currentProfile()
  if (!isStaff(profile?.role ?? null)) redirect('/no-autorizado')

  const [allProfiles, groups] = await Promise.all([listProfiles(), listGroups()])
  const players = allProfiles.filter((p) => p.role === 'deportista')

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/rutinas">Rutinas</BackLink>
      <h1 className="mb-6 readout text-3xl">Nueva rutina</h1>
      <RoutineForm
        action={createRoutine}
        submitLabel="Crear rutina"
        players={players}
        groups={groups}
      />
    </div>
  )
}