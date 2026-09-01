'use client'

import { useActionState } from 'react'
import { createUserAccount } from '@/actions/users'
import { ROLES, labelOf } from '@/lib/access'

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export function UserForm() {
  const [state, formAction] = useActionState(
    (_prev: { error?: string }, formData: FormData) => createUserAccount(formData),
    {}
  )

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold tracking-tight">Nuevo jugador</h2>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Nombre completo</span>
        <input name="full_name" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Correo</span>
        <input name="email" type="email" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Contraseña</span>
        <input name="password" type="password" required minLength={6} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Rol</span>
        <select name="role" defaultValue="deportista" className={inputClass}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {labelOf(r)}
            </option>
          ))}
        </select>
      </label>

      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Crear jugador
      </button>
    </form>
  )
}