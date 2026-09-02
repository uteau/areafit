export type Role = 'admin' | 'entrenador' | 'deportista'

export interface Profile {
  id: string
  full_name: string
  role: Role
  created_at: string
}

export type EventType = 'partido' | 'entrenamiento' | 'evento'

export interface EventRow {
  id: string
  title: string
  event_type: EventType
  starts_at: string
  location: string
  description: string
  created_by: string | null
  created_at: string
}

export interface EventFormInput {
  title: string
  event_type: EventType
  starts_at: string
  location: string
  description: string
}

export interface Routine {
  id: string
  title: string
  description: string
  created_by: string | null
  assigned_to_player: string | null
  assigned_to_group: string | null
  created_at: string
}

export interface Exercise {
  id: string
  routine_id: string
  name: string
  sets: number | null
  reps: string | null
  notes: string
  position: number
}

export interface PlayerGroup {
  id: string
  name: string
  description: string
  created_by: string | null
  created_at: string
}

export interface PlayerGroupMember {
  group_id: string
  player_id: string
}