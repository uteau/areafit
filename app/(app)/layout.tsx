import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/db/users'
import { Sidebar } from '@/components/sidebar'

async function SidebarSection() {
  const profile = await currentProfile()
  if (!profile) redirect('/login')
  return <Sidebar profile={profile} />
}

function SidebarFallback() {
  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col border-r border-seam bg-cabinet">
        <div className="px-6 pt-7 pb-5">
          <span className="brand text-lg">AreaFit</span>
          <span className="mt-1 block pl-[22px] text-xs font-medium text-lit/55">Voleibol</span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Secciones">
          {['Calendario', 'Rutinas'].map((label) => (
            <div key={label} className="h-10 animate-pulse rounded-lg bg-plate" />
          ))}
        </nav>
        <div className="border-t border-seam px-6 py-4">
          <div className="h-4 w-28 animate-pulse rounded bg-plate" />
        </div>
      </aside>
      <header className="lg:hidden sticky top-0 z-30 border-b border-seam bg-cabinet/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
          <span className="brand text-sm">
            <span className="brand-dot" aria-hidden="true" />
            AreaFit
          </span>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-plate" />
        </div>
      </header>
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-seam bg-cabinet" aria-hidden="true">
        <div className="flex justify-around py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-5 w-12 animate-pulse rounded bg-plate" />
          ))}
        </div>
      </nav>
    </>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-hall lg:flex-row">
      <Suspense fallback={<SidebarFallback />}>
        <SidebarSection />
      </Suspense>
      <main className="flex-1 min-w-0 px-5 pt-6 pb-28 lg:px-10 lg:py-10 lg:pb-10">
        {children}
      </main>
    </div>
  )
}