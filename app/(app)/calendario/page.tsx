import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { listEvents } from '@/lib/db/events'
import { getMonthGrid, dayKey } from '@/lib/calendar'
import { isStaff } from '@/lib/access'
import { CalendarGrid } from '@/components/calendar-grid'
import { EventCard } from '@/components/event-card'
import type { EventRow } from '@/lib/types'

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; anio?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const year = params.anio ? Number(params.anio) : now.getFullYear()
  const month = params.mes ? Number(params.mes) : now.getMonth()

  const weeks = getMonthGrid(year, month)
  const events = await listEvents()

  const eventsByDay = new Map<string, EventRow[]>()
  for (const ev of events) {
    const key = dayKey(new Date(ev.starts_at))
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev])
  }

  const upcoming = events
    .filter((ev) => new Date(ev.starts_at) >= now)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    .slice(0, 10)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()
  const staff = isStaff(profile?.role ?? null)

  const prev = addMonths(year, month, -1)
  const next = addMonths(year, month, 1)
  const prevYear = { year: year - 1, month }
  const nextYear = { year: year + 1, month }
  const monthLabel = new Date(year, month, 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Calendario</h1>
        {staff ? (
          <Link
            href="/calendario/nuevo"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Nuevo evento
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <a
                href={`?mes=${prevYear.month}&anio=${prevYear.year}`}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Año anterior"
              >
                ‹‹
              </a>
              <a
                href={`?mes=${prev.month}&anio=${prev.year}`}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Mes anterior"
              >
                ‹
              </a>
            </div>
            <h2 className="text-sm font-semibold capitalize text-slate-900">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <a
                href={`?mes=${next.month}&anio=${next.year}`}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Mes siguiente"
              >
                ›
              </a>
              <a
                href={`?mes=${nextYear.month}&anio=${nextYear.year}`}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Año siguiente"
              >
                ››
              </a>
            </div>
          </div>
          <CalendarGrid weeks={weeks} eventsByDay={eventsByDay} today={now} />
        </div>

        <aside>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Próximos eventos
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No hay eventos próximos</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}