import Link from 'next/link'
import type { EventRow } from '@/lib/types'
import { WEEKDAYS, dayKey, isSameDay } from '@/lib/calendar'
import { EVENT_TYPE_PIP } from '@/lib/event-labels'

export function CalendarGrid({
  weeks,
  eventsByDay,
  today,
}: {
  weeks: (Date | null)[][]
  eventsByDay: Map<string, EventRow[]>
  today: Date
}) {
  const totalEvents = [...eventsByDay.values()].reduce((sum, list) => sum + list.length, 0)

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th
                key={day}
                className="border-b border-slate-200 px-2 pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((cell, ci) => {
                if (!cell) {
                  return <td key={ci} className="border border-slate-100 bg-slate-50/50" />
                }
                const key = dayKey(cell)
                const dayEvents = eventsByDay.get(key) ?? []
                const isToday = isSameDay(cell, today)

                return (
                  <td
                    key={ci}
                    className={`border border-slate-100 align-top p-1.5 ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        isToday ? 'bg-blue-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      {cell.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <Link
                          key={ev.id}
                          href={`/calendario/${ev.id}`}
                          className="flex items-center gap-1.5 rounded px-1 py-0.5 text-[11px] leading-tight text-slate-700 hover:bg-slate-100"
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${EVENT_TYPE_PIP[ev.event_type]}`} />
                          <span className="truncate">{ev.title}</span>
                        </Link>
                      ))}
                      {dayEvents.length > 2 ? (
                        <p className="px-1 text-[11px] text-slate-400">+{dayEvents.length - 2} más</p>
                      ) : null}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {totalEvents === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No hay eventos este mes</p>
      ) : null}
    </div>
  )
}