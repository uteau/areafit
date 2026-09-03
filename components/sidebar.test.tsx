import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar, MobileHeader } from './sidebar'
import type { Role } from '@/lib/access'

vi.mock('next/link', () => {
  return {
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string | { href: string }
      children: React.ReactNode
    }) => (
      <a href={typeof href === 'string' ? href : href.href} {...rest}>
        {children}
      </a>
    ),
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/calendario',
}))

const profile = { id: '1', full_name: 'Jugador Uno', role: 'deportista' as Role }

describe('MobileHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('abre el menú al pulsar la hamburguesa y lo cierra con la X', () => {
    render(<MobileHeader profile={profile} />)

    const abrir = screen.getByRole('button', { name: 'Abrir menú' })
    fireEvent.click(abrir)

    expect(screen.getByText('Jugador Uno')).toBeInTheDocument()
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()

    const cerrar = screen.getByRole('button', { name: 'Cerrar menú' })
    fireEvent.click(cerrar)

    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })
})

describe('Sidebar', () => {
  it('renderiza la navegación con landmarks accesibles', () => {
    render(<Sidebar profile={profile} />)
    const navs = screen.getAllByRole('navigation')
    expect(navs).toHaveLength(2)
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument()
    expect(screen.getAllByText('Calendario').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Rutinas').length).toBeGreaterThan(0)
  })
})
