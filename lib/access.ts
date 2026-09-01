export type Role = 'admin' | 'entrenador' | 'deportista'

export const ROLES: Role[] = ['admin', 'entrenador', 'deportista']

export function isStaff(role: Role | null | undefined): boolean {
  return role === 'admin' || role === 'entrenador'
}

export function labelOf(role: Role): string {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'entrenador':
      return 'Entrenador'
    case 'deportista':
      return 'Deportista'
  }
}