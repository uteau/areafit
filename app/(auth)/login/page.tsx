import { signIn } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  return (
    <main className="flex min-h-svh items-center justify-center bg-hall p-6">
      <div className="w-full max-w-sm rounded-2xl border border-seam bg-cabinet p-8 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]">
        <div className="flex flex-col items-center text-center">
          <span className="brand text-xl">
            <span className="brand-dot" aria-hidden="true" />
            AreaFit
          </span>
          <p className="mt-2 text-sm font-medium text-lit/55">Inicia sesión para continuar</p>
        </div>

        {error ? (
          <p
            className="notice-error mt-5 rounded-md px-3 py-2 text-sm font-medium"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form action={signIn} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
            <span>Correo</span>
            <input name="email" type="email" required autoComplete="email" className="field" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-lit/80">
            <span>Contraseña</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field"
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  )
}