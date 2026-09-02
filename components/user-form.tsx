'use client'

import { useActionState } from 'react'
import { createUserAccount } from '@/actions/users'
import { ROLES, labelOf } from '@/lib/access'

export function UserForm() {
  const [state, formAction] = useActionState(
    (_prev: { error?: string }, formData: FormData) => createUserAccount(formData),
    {}
  )

  return (
    <form action={formAction} className="panel max-w-md space-y-4 p-6">
      <h2 className="readout text-lg">Nuevo jugador</h2>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Nombre completo</span>
        <input name="full_name" required className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Correo</span>
        <input name="email" type="email" required className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Contraseña</span>
        <input name="password" type="password" required minLength={6} className="field" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
        <span>Rol</span>
        <select name="role" defaultValue="deportista" className="field">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {labelOf(r)}
            </option>
          ))}
        </select>
      </label>

      {state?.error ? (
        <p className="notice-error rounded-md px-3 py-2 text-sm font-medium" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary">
        Crear jugador
      </button>
    </form>
  )
}