import Link from 'next/link'

export default function NoAutorizadoPage() {
  return (
    <div className="mx-auto max-w-md pt-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">No autorizado</h1>
      <p className="mt-2 text-slate-600">No tienes permiso para esta acción.</p>
      <Link href="/calendario" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
        Volver al calendario
      </Link>
    </div>
  )
}