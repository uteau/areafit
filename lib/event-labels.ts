import type { EventType } from '@/lib/types'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  partido: 'Partido',
  entrenamiento: 'Entrenamiento',
  evento: 'Evento',
}

export const EVENT_TYPE_LAMP: Record<EventType, string> = {
  partido: 'lamp-partido',
  entrenamiento: 'lamp-entrenamiento',
  evento: 'lamp-evento',
}

export const EVENT_TYPE_BADGE: Record<EventType, string> = {
  partido: 'bg-lamp/15 text-lamp',
  entrenamiento: 'bg-lit/10 text-lit',
  evento: 'bg-seam text-lit/70',
}