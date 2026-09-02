import type { Profile } from '@/lib/types'
import { labelOf } from '@/lib/access'
import { removeUser } from '@/actions/users'
import { ConfirmDelete } from '@/components/confirm-delete'
import { RoleForm } from '@/components/role-form'

export function UserTable({ users }: { users: (Profile & { email: string })[] }) {
  if (users.length === 0) {
    return <p className="text-sm font-medium text-lit/45">Aún no hay jugadores</p>
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-seam text-[11px] font-bold uppercase tracking-[0.14em] text-lit/50">
            <th className="px-4 py-3 font-bold">Nombre</th>
            <th className="px-4 py-3 font-bold">Email</th>
            <th className="px-4 py-3 font-bold">Rol</th>
            <th className="px-4 py-3 font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-seam last:border-0">
              <td className="px-4 py-3 font-bold text-lit">{user.full_name}</td>
              <td className="px-4 py-3 text-lit/60">{user.email}</td>
              <td className="px-4 py-3">
                <span className="pill">{labelOf(user.role)}</span>
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