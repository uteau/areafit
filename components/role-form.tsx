'use client'

import { useActionState } from 'react'
import { changeUserRole } from '@/actions/users'
import { ROLES, labelOf } from '@/lib/access'
import type { Role } from '@/lib/access'

export function RoleForm({ userId, currentRole }: { userId: string; currentRole: Role }) {
  const [state, formAction] = useActionState(
    (_prev: { error?: string }, formData: FormData) => changeUserRole(userId, formData),
    {}
  )

  return (
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {labelOf(r)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Guardar
      </button>
      {state?.error ? (
        <span className="text-xs text-red-600" role="alert">
          {state.error}
        </span>
      ) : null}
    </form>
  )
}