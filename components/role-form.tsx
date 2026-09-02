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
      <select name="role" defaultValue={currentRole} className="field !w-auto !py-1.5">
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {labelOf(r)}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-ghost !px-3 !py-1.5">
        Guardar
      </button>
      {state?.error ? (
        <span className="text-xs font-semibold text-lamp" role="alert">
          {state.error}
        </span>
      ) : null}
    </form>
  )
}