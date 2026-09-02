'use client'

import { useState } from 'react'
import type { PlayerGroup, Profile } from '@/lib/types'

export function RoutineAssignmentSelect({
  players,
  groups,
  defaults,
}: {
  players: Profile[]
  groups: PlayerGroup[]
  defaults?: {
    assigned_to_player: string | null
    assigned_to_group: string | null
  }
}) {
  const initialType = defaults?.assigned_to_player
    ? 'player'
    : defaults?.assigned_to_group
      ? 'group'
      : 'none'

  const [assignmentType, setAssignmentType] = useState<string>(initialType)

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Asignar a</span>
        <select
          name="assignment_type"
          value={assignmentType}
          onChange={(e) => setAssignmentType(e.target.value)}
          className="field"
        >
          <option value="none">Sin asignar</option>
          <option value="player">Jugador individual</option>
          <option value="group">Grupo</option>
        </select>
      </label>

      {assignmentType === 'player' ? (
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Jugador</span>
          <select
            name="assigned_to_player"
            defaultValue={defaults?.assigned_to_player ?? ''}
            className="field"
          >
            <option value="">Seleccionar jugador…</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {assignmentType === 'group' ? (
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
          <span>Grupo</span>
          <select
            name="assigned_to_group"
            defaultValue={defaults?.assigned_to_group ?? ''}
            className="field"
          >
            <option value="">Seleccionar grupo…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}