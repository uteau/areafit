import Link from 'next/link'
import { listGroups } from '@/lib/db/groups'
import { currentProfile } from '@/lib/db/users'
import { isStaff } from '@/lib/access'
import { PageHeader } from '@/components/page-header'
import { IconPlus } from '@/components/icons'

export default async function GruposPage() {
  const [groups, profile] = await Promise.all([listGroups(), currentProfile()])
  const staff = isStaff(profile?.role ?? null)

  return (
    <div>
      <PageHeader title="Grupos">
        {staff ? (
          <Link href="/grupos/new" className="btn btn-primary">
            <IconPlus size={16} />
            Nuevo grupo
          </Link>
        ) : null}
      </PageHeader>

      {groups.length === 0 ? (
        <p className="text-sm font-medium text-lit/45">No hay grupos todavía</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/grupos/${group.id}`}
              className="rounded-xl border border-seam bg-cabinet p-5 transition-colors hover:border-seam-bright"
            >
              <h2 className="readout text-lg">{group.name}</h2>
              {group.description ? (
                <p className="mt-1 truncate text-sm text-lit/55">{group.description}</p>
              ) : null}
              <p className="mt-3 text-xs font-semibold text-lit/45">
                {group.member_count} {group.member_count === 1 ? 'miembro' : 'miembros'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}