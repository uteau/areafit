'use client'

import { useState, type ReactNode } from 'react'
import type { EventRow } from '@/lib/types'
import { dayKey, formatDayLong } from '@/lib/calendar'
import { CalendarGrid } from '@/components/calendar-grid'
import { EventCard } from '@/components/event-card'

export function CalendarApp({
  weeks,
  eventsByDay,
  upcoming,
  today,
  monthKey,
  nav,
}: {
  weeks: (Date | null)[][]
  eventsByDay: Map<string, EventRow[]>
  upcoming: EventRow[]
  today: Date
  monthKey: string
  nav: ReactNode
}) {
  const [selectedDay, setSelectedDay] = useState<Date>(today)

  const dayEvents = eventsByDay.get(dayKey(selectedDay)) ?? []
  const afterEvents = upcoming.filter((ev) => {
    const d = new Date(ev.starts_at)
    return d > selectedDay && dayKey(d) !== dayKey(selectedDay)
  }).slice(0, 10)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="panel p-3 sm:p-4">
        {nav}
        <CalendarGrid
          weeks={weeks}
          eventsByDay={eventsByDay}
          today={today}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          monthKey={monthKey}
        />
      </div>

      <aside>
        <h3 className="mb-3 eyebrow capitalize">{formatDayLong(selectedDay)}</h3>
        {dayEvents.length === 0 ? (
          <p className="text-sm font-medium text-lit/60">No hay eventos este día</p>
        ) : (
          <div className="space-y-2">
            {dayEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        <h3 className="mt-6 mb-3 eyebrow">Próximos eventos</h3>
        {afterEvents.length === 0 ? (
          <p className="text-sm font-medium text-lit/60">No hay eventos próximos</p>
        ) : (
          <div className="space-y-2">
            {afterEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
