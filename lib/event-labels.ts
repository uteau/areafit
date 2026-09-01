import type { EventType } from '@/lib/types'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  partido: 'Partido',
  entrenamiento: 'Entrenamiento',
  evento: 'Evento',
}

export const EVENT_TYPE_BADGE: Record<EventType, string> = {
  partido: 'bg-emerald-100 text-emerald-700',
  entrenamiento: 'bg-blue-100 text-blue-700',
  evento: 'bg-amber-100 text-amber-700',
}

export const EVENT_TYPE_PIP: Record<EventType, string> = {
  partido: 'bg-emerald-500',
  entrenamiento: 'bg-blue-500',
  evento: 'bg-amber-500',
}