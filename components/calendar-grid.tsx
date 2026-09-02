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

  return (
    <div className="poweron" key={monthKey}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  className="px-1 pb-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-lit/50"
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
                      className={`border-t border-l first:border-l-0 border-seam/60 p-1 align-top ${
                        isToday ? 'bg-lamp/15' : ''
                      }`}
                    >
                      <div className="mx-auto flex aspect-square w-[32px] items-center justify-center sm:w-8">
                        <button
                          type="button"
                          onClick={() => onSelectDay(cell)}
                          aria-pressed={isSelected}
                          aria-label={`Día ${cell.getDate()}`}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-extrabold tabular-nums transition-colors ${
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
        <p className="mt-4 text-sm font-medium text-lit/45">No hay eventos este mes</p>
      ) : null}
    </div>
  )
}
