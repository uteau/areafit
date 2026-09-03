'use client'

import { useRef } from 'react'
import Link from 'next/link'
import type { EventRow } from '@/lib/types'
import { WEEKDAYS, dayKey, isSameDay } from '@/lib/calendar'
import { EVENT_TYPE_LAMP } from '@/lib/event-labels'

export function CalendarGrid({
  weeks,
  eventsByDay,
  today,
  selectedDay,
  onSelectDay,
  monthKey,
}: {
  weeks: (Date | null)[][]
  eventsByDay: Map<string, EventRow[]>
  today: Date
  selectedDay: Date
  onSelectDay: (date: Date) => void
  monthKey: string
}) {
  const totalEvents = [...eventsByDay.values()].reduce((sum, list) => sum + list.length, 0)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(e: React.KeyboardEvent) {
    const key = e.key
    const nav = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']
    if (!nav.includes(key)) return
    e.preventDefault()

    let next: Date
    if (key === 'Home' || key === 'PageUp') {
      next = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), 1)
    } else if (key === 'End' || key === 'PageDown') {
      next = new Date(selectedDay.getFullYear(), selectedDay.getMonth() + 1, 0)
    } else if (
      key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'
    ) {
      const step = { ArrowUp: -7, ArrowDown: 7, ArrowLeft: -1, ArrowRight: 1 }[key]
      next = new Date(selectedDay)
      next.setDate(next.getDate() + step)
    } else {
      return
    }

    if (!containerRef.current?.querySelector(`[data-day="${dayKey(next)}"]`)) return
    onSelectDay(next)
    containerRef.current
      .querySelector<HTMLButtonElement>(`[data-day="${dayKey(next)}"]`)
      ?.focus()
  }

  return (
    <div ref={containerRef} className="poweron" key={monthKey} onKeyDown={handleKeyDown}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  className="px-1 pb-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-lit/60"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((cell, ci) => {
                  if (!cell) {
                    return (
                      <td
                        key={ci}
                        className="border-t border-l first:border-l-0 border-seam/60 bg-hall/40 p-1"
                      />
                    )
                  }
                  const key = dayKey(cell)
                  const dayEvents = eventsByDay.get(key) ?? []
                  const isToday = isSameDay(cell, today)
                  const isSelected = isSameDay(cell, selectedDay)

                  return (
                    <td
                      key={ci}
                      className={`min-w-0 border-t border-l first:border-l-0 border-seam/60 p-1 align-top ${
                        isToday ? 'bg-lamp/15' : ''
                      }`}
                    >
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => onSelectDay(cell)}
                          tabIndex={isSelected ? 0 : -1}
                          data-day={key}
                          aria-label={`Día ${cell.getDate()}`}
                          className={`aspect-square w-[min(44px,100%)] rounded-md text-[13px] font-extrabold tabular-nums transition-colors sm:aspect-auto sm:w-7 sm:h-7 ${
                            isSelected
                              ? 'bg-lamp text-white shadow-[0_0_14px_rgba(227,27,35,0.5)]'
                              : isToday
                                ? 'ring-1 ring-inset ring-lamp/60 text-lamp'
                                : 'text-lit/85 hover:bg-lit/10'
                          }`}
                        >
                          {cell.getDate()}
                        </button>
                      </div>
                      <div className="mt-1 flex justify-center gap-1">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <Link
                            key={ev.id}
                            href={`/calendario/${ev.id}`}
                            aria-label={ev.title}
                            className={`h-1.5 w-1.5 rounded-full ${EVENT_TYPE_LAMP[ev.event_type]}`}
                          />
                        ))}
                        {dayEvents.length > 3 ? (
                          <span className="text-[9px] font-bold text-lit/40">
                            +{dayEvents.length - 3}
                          </span>
                        ) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalEvents === 0 ? (
        <p className="mt-4 text-sm font-medium text-lit/60">No hay eventos este mes</p>
      ) : null}
    </div>
  )
}
