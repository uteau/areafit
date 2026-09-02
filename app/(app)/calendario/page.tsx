import Link from "next/link";
import { listEvents } from "@/lib/db/events";
import { currentProfile } from "@/lib/db/users";
import { getMonthGrid, dayKey } from "@/lib/calendar";
import { isStaff } from "@/lib/access";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventCard } from "@/components/event-card";
import { PageHeader } from "@/components/page-header";
import { IconChevron, IconChevrons, IconPlus } from "@/components/icons";
import type { EventRow } from "@/lib/types";

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; anio?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.anio ? Number(params.anio) : now.getFullYear();
  const month = params.mes ? Number(params.mes) : now.getMonth();

  const weeks = getMonthGrid(year, month);
  const [events, profile] = await Promise.all([listEvents(), currentProfile()]);

  const eventsByDay = new Map<string, EventRow[]>();
  for (const ev of events) {
    const key = dayKey(new Date(ev.starts_at));
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev]);
  }

  const upcoming = events
    .filter((ev) => new Date(ev.starts_at) >= now)
    .sort(
      (a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    )
    .slice(0, 10);

  const staff = isStaff(profile?.role ?? null);

  const prev = addMonths(year, month, -1);
  const next = addMonths(year, month, 1);
  const prevYear = { year: year - 1, month };
  const nextYear = { year: year + 1, month };
  const monthLabel = new Date(year, month, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const monthKey = `${year}-${month}`;

  return (
    <div>
      <PageHeader title="Calendario">
        {staff ? (
          <Link href="/calendario/new" className="btn btn-primary">
            <IconPlus size={16} />
            Nuevo evento
          </Link>
        ) : null}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="panel p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between border-b border-seam pb-3">
            <div className="flex items-center gap-1">
              <a
                href={`?mes=${prevYear.month}&anio=${prevYear.year}`}
                className="btn btn-ghost !p-2"
                title="Año anterior"
                aria-label="Año anterior"
              >
                <IconChevrons dir="l" size={16} />
              </a>
              <a
                href={`?mes=${prev.month}&anio=${prev.year}`}
                className="btn btn-ghost !p-2"
                title="Mes anterior"
                aria-label="Mes anterior"
              >
                <IconChevron dir="l" size={16} />
              </a>
            </div>
            <h2 className="readout capitalize text-lg sm:text-xl">
              {monthLabel}
            </h2>
            <div className="flex items-center gap-1">
              <a
                href={`?mes=${next.month}&anio=${next.year}`}
                className="btn btn-ghost !p-2"
                title="Mes siguiente"
                aria-label="Mes siguiente"
              >
                <IconChevron dir="r" size={16} />
              </a>
              <a
                href={`?mes=${nextYear.month}&anio=${nextYear.year}`}
                className="btn btn-ghost !p-2"
                title="Año siguiente"
                aria-label="Año siguiente"
              >
                <IconChevrons dir="r" size={16} />
              </a>
            </div>
          </div>
          <CalendarGrid
            weeks={weeks}
            eventsByDay={eventsByDay}
            today={now}
            monthKey={monthKey}
          />
        </div>

        <aside>
          <h3 className="mb-3 eyebrow">Próximos eventos</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm font-medium text-lit/45">
              No hay eventos próximos
            </p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
