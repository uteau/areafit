import type { ReactNode } from 'react'

export function PageHeader({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="eyebrow">Área Fit · Voleibol</p>
        <h1 className="mt-1 readout text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  )
}