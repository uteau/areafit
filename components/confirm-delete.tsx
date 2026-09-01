'use client'

export function ConfirmDelete({
  action,
  message = '¿Confirmar eliminación?',
  children = 'Eliminar',
}: {
  action: (formData: FormData) => void
  message?: string
  children?: React.ReactNode
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
      >
        {children}
      </button>
    </form>
  )
}