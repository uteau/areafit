export default function AppLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="animate-pulse">
      <div className="h-9 w-40 rounded-md bg-cabinet" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl border border-seam bg-cabinet p-4">
          <div className="mb-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-plate" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-seam bg-cabinet" />
          ))}
        </div>
      </div>
    </div>
  )
}
