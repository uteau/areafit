'use client'

import { labelOf } from '@/lib/access'
import type { Role } from '@/lib/access'

export function UserMenu({ profile }: { profile: { full_name: string; role: Role } }) {
  return (
    <div className="border-t border-slate-200 px-6 py-4">
      <p className="truncate text-sm font-medium text-slate-900">{profile.full_name}</p>
      <p className="text-xs text-slate-500">{labelOf(profile.role)}</p>
      <form action="/logout" method="post" className="mt-3">
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}