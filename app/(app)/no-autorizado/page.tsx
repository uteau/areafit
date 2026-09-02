import Link from 'next/link'
import { IconArrowLeft } from '@/components/icons'

export default function NoAutorizadoPage() {
  return (
    <div className="mx-auto max-w-md pt-20 text-center">
      <h1 className="readout text-3xl">No autorizado</h1>
      <p className="mt-2 text-base font-medium text-lit/60">
        No tienes permiso para esta acción.
      </p>
      <Link href="/calendario" className="btn btn-ghost mt-6 inline-flex">
        <IconArrowLeft size={15} />
        Volver al calendario
      </Link>
    </div>
  )
}