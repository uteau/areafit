import type { Profile } from '@/lib/types'
import { labelOf } from '@/lib/access'
import { removeUser } from '@/actions/users'
import { ConfirmDelete } from '@/components/confirm-delete'
import { RoleForm } from '@/components/role-form'

export function UserTable({ users }: { users: (Profile & { email: string })[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-slate-500">Aún no hay jugadores</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Rol</th>
            <th className="px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-slate-900">{user.full_name}</td>
              <td className="px-4 py-3 text-slate-600">{user.email}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {labelOf(user.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <RoleForm userId={user.id} currentRole={user.role} />
                  <ConfirmDelete
                    action={removeUser.bind(null, user.id)}
                    message="¿Desactivar este usuario?"
                  >
                    Desactivar
                  </ConfirmDelete>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}