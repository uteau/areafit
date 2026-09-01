import { describe, it, expect } from 'vitest'
import { isStaff, labelOf } from './access'

describe('access', () => {
  it('isStaff true para admin y entrenador, falso para deportista y sin rol', () => {
    expect(isStaff('admin')).toBe(true)
    expect(isStaff('entrenador')).toBe(true)
    expect(isStaff('deportista')).toBe(false)
    expect(isStaff(null)).toBe(false)
    expect(isStaff(undefined)).toBe(false)
  })

  it('labelOf devuelve etiquetas en español', () => {
    expect(labelOf('admin')).toBe('Admin')
    expect(labelOf('entrenador')).toBe('Entrenador')
    expect(labelOf('deportista')).toBe('Deportista')
  })
})