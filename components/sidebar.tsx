'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isStaff } from '@/lib/access'
import type { Role } from '@/lib/access'
import { UserMenu } from '@/components/user-menu'

export function Sidebar({ profile }: { profile: { id: string; full_name: string; role: Role } }) {
  const pathname = usePathname()
  const links = [
    { href: '/calendario', label: 'Calendario' },
    { href: '/rutinas', label: 'Rutinas' },
    ...(isStaff(profile.role) ? [{ href: '/usuarios', label: 'Usuarios' }] : []),
  ]

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="px-6 py-5 text-xl font-bold tracking-tight">AreaFit</div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <UserMenu profile={profile} />
    </aside>
  )
}