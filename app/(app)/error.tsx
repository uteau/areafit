'use client'

export default function AppError({
  retry,
}: {
  retry: () => void
}) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="readout text-3xl">Algo salió mal</h1>
      <p className="mt-3 text-sm font-medium text-lit/55">
        No se pudo cargar esta sección. Vuelve a intentarlo.
      </p>
      <button type="button" onClick={() => retry()} className="btn btn-primary mt-6">
        Reintentar
      </button>
    </div>
  )
}