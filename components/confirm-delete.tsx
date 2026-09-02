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
      <button type="submit" className="btn btn-danger">
        {children}
      </button>
    </form>
  )
}