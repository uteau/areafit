'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isStaff } from '@/lib/access'
import type { Role } from '@/lib/access'
import { UserMenu } from '@/components/user-menu'
import {
  IconCalendar,
  IconDumbbell,
  IconLogOut,
  IconUsers,
} from '@/components/icons'

function navItems(role: Role) {
  const base: { href: string; label: string; icon: typeof IconCalendar }[] = [
    { href: '/calendario', label: 'Calendario', icon: IconCalendar },
    { href: '/rutinas', label: 'Rutinas', icon: IconDumbbell },
  ]
  if (isStaff(role)) base.push({ href: '/usuarios', label: 'Equipo', icon: IconUsers })
  return base
}

export function Sidebar({ profile }: { profile: { id: string; full_name: string; role: Role } }) {
  const pathname = usePathname()
  const items = navItems(profile.role)

  return (
    <>
      {/* Desktop rail: cabinet column */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-seam bg-cabinet">
        <div className="px-6 pt-7 pb-5">
          <span className="brand text-lg">AreaFit</span>
          <span className="mt-1 block pl-[22px] text-xs font-medium text-lit/55">Voleibol</span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Secciones">
          {items.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`console-link ${active ? 'console-link-active' : ''}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <UserMenu profile={profile} />
      </aside>

      {/* Mobile header: cabinet strip with brand + session */}
      <header className="lg:hidden sticky top-0 z-30 border-b border-seam bg-cabinet/95 backdrop-blur px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between">
        <span className="brand text-base">
          <span className="brand-dot" aria-hidden="true" />
          AreaFit
        </span>
        <div className="flex items-center gap-2">
          <span className="max-w-[120px] truncate text-sm font-semibold text-lit">
            {profile.full_name}
          </span>
          <form action="/logout" method="post">
            <button
              type="submit"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="btn btn-ghost !p-2"
            >
              <IconLogOut size={16} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile bottom console: the scoreboard's console strip */}
      <nav
        className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-seam bg-cabinet px-2 pb-[env(safe-area-inset-bottom)]"
        aria-label="Secciones"
      >
        <div className="flex">
          {items.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
                  active ? 'text-lit' : 'text-lit/50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 h-0.5 rounded-full bg-lamp transition-opacity ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ width: 26 }}
                />
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}