import Link from 'next/link'
import { IconArrowLeft } from '@/components/icons'

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-lit/60 transition-colors hover:text-lit"
    >
      <IconArrowLeft size={15} />
      {children}
    </Link>
  )
}