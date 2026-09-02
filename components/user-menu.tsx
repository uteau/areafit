'use client'

import { labelOf } from '@/lib/access'
import type { Role } from '@/lib/access'
import { IconLogOut } from '@/components/icons'

export function UserMenu({ profile }: { profile: { full_name: string; role: Role } }) {
  return (
    <div className="border-t border-seam px-6 py-4">
      <p className="truncate text-sm font-semibold text-lit">{profile.full_name}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-lamp">
        {labelOf(profile.role)}
      </p>
      <form action="/logout" method="post" className="mt-3">
        <button type="submit" className="w-full btn btn-ghost">
          <IconLogOut size={16} />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}