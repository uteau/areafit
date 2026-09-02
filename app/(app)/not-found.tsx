import { BackLink } from '@/components/back-link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="readout text-3xl">No encontrado</h1>
      <p className="mt-3 text-sm font-medium text-lit/55">
        Esta página no existe o ya no está disponible.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <BackLink href="/calendario">Volver al calendario</BackLink>
      </div>
    </div>
  )
}