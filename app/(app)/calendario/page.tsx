import Link from "next/link";
import { listEvents } from "@/lib/db/events";
import { currentProfile } from "@/lib/db/users";
import { getMonthGrid, dayKey } from "@/lib/calendar";
import { isStaff } from "@/lib/access";
import { CalendarApp } from "@/components/calendar-app";
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
  const monthStart = new Date(year, month - 1, 25);
  const monthEnd = new Date(year, month + 1, 10);
  const [monthEvents, upcoming, profile] = await Promise.all([
    listEvents(monthStart, monthEnd),
    listEvents(now, undefined, 10),
    currentProfile(),
  ]);

  const eventsByDay = new Map<string, EventRow[]>();
  for (const ev of monthEvents) {
    const key = dayKey(new Date(ev.starts_at));
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev]);
  }

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

  const nav = (
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
      <h2 className="readout capitalize text-lg sm:text-xl">{monthLabel}</h2>
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
  );


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

      <CalendarApp
        weeks={weeks}
        eventsByDay={eventsByDay}
        upcoming={upcoming}
        today={now}
        monthKey={monthKey}
        nav={nav}
      />
    </div>
  );
}
