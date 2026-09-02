'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isStaff, labelOf } from '@/lib/access'
import type { Role } from '@/lib/access'
import { UserMenu } from '@/components/user-menu'
import {
  IconCalendar,
  IconDumbbell,
  IconLogOut,
  IconMenu,
  IconUsers,
  IconX,
} from '@/components/icons'

function navItems(role: Role) {
  const base: { href: string; label: string; icon: typeof IconCalendar }[] = [
    { href: '/calendario', label: 'Calendario', icon: IconCalendar },
    { href: '/rutinas', label: 'Rutinas', icon: IconDumbbell },
  ]
  if (isStaff(role)) base.push({ href: '/usuarios', label: 'Equipo', icon: IconUsers })
  return base
}

export function MobileHeader({ profile }: { profile: { id: string; full_name: string; role: Role } }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className="lg:hidden sticky top-0 z-30 border-b border-seam bg-cabinet/95 backdrop-blur"
    >
      <div className="flex h-14 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <span className="brand text-sm">
          <span className="brand-dot" aria-hidden="true" />
          AreaFit
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-haspopup="menu"
          className="btn btn-ghost !p-2"
        >
          {open ? <IconX size={18} /> : <IconMenu size={18} />}
        </button>
      </div>

      {open ? (
        <div
          role="menu"
          className="absolute inset-x-4 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-seam bg-cabinet p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-lit">{profile.full_name}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-lamp">
                {labelOf(profile.role)}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-seam pt-4">
            <form action="/logout" method="post">
              <button type="submit" role="menuitem" className="w-full btn btn-ghost">
                <IconLogOut size={16} />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  )
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

      {/* Mobile header: slim brand strip with hamburger menu */}
      <MobileHeader profile={profile} />

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