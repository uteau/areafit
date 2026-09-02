'use client'

import { useTransition } from 'react'
import { addGroupMember, removeGroupMember } from '@/actions/groups'
import type { Profile } from '@/lib/types'

export function GroupMemberManager({
  groupId,
  members,
  allPlayers,
}: {
  groupId: string
  members: Profile[]
  allPlayers: Profile[]
}) {
  const [pending, startTransition] = useTransition()

  const memberIds = new Set(members.map((m) => m.id))
  const available = allPlayers.filter((p) => !memberIds.has(p.id))

  function handleAdd(playerId: string) {
    startTransition(async () => {
      await addGroupMember(groupId, playerId)
    })
  }

  function handleRemove(playerId: string) {
    startTransition(async () => {
      await removeGroupMember(groupId, playerId)
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="readout text-xl">Miembros</h2>

      {members.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">No hay miembros en este grupo</p>
      ) : (
        <ul className="space-y-2">
          {members.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-seam bg-cabinet p-3"
            >
              <span className="text-sm font-semibold text-lit">{player.full_name}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleRemove(player.id)}
                className="btn btn-danger text-xs flex items-center gap-1.5"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      {available.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">Todos los deportistas ya están en el grupo</p>
      ) : (
        <ul className="space-y-2">
          {available.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-lime/30 bg-cabinet p-3"
            >
              <span className="text-sm font-semibold text-lit">{player.full_name}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleAdd(player.id)}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                Agregar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
