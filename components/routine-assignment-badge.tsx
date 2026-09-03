export function RoutineAssignmentBadge({
  assignedToPlayer,
  assignedToGroup,
  playerMap,
  groupMap,
}: {
  assignedToPlayer: string | null
  assignedToGroup: string | null
  playerMap?: Map<string, string>
  groupMap?: Map<string, string>
}) {
  if (!assignedToPlayer && !assignedToGroup) {
    return (
      <span className="inline-flex items-center rounded-full bg-plate px-2.5 py-0.5 text-xs font-semibold text-lit/60">
        Sin asignar
      </span>
    )
  }

  if (assignedToPlayer) {
    const name = playerMap?.get(assignedToPlayer) ?? 'Jugador'
    return (
      <span className="inline-flex items-center rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-semibold text-lamp">
        Personal · {name}
      </span>
    )
  }

  if (assignedToGroup) {
    const name = groupMap?.get(assignedToGroup) ?? 'Grupo'
    return (
      <span className="inline-flex items-center rounded-full bg-plate px-2.5 py-0.5 text-xs font-semibold text-lit">
        Equipo · {name}
      </span>
    )
  }

  return null
}