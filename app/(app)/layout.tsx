import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/db/users'
import { Sidebar } from '@/components/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await currentProfile()
  if (!profile) redirect('/login')

  return (
    <div className="flex min-h-svh flex-col bg-hall lg:flex-row">
      <Sidebar profile={profile} />
      <main className="flex-1 min-w-0 px-5 pt-6 pb-28 lg:px-10 lg:py-10 lg:pb-10">
        {children}
      </main>
    </div>
  )
}