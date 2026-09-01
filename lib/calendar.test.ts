import { describe, it, expect } from 'vitest'
import { getMonthGrid, isSameDay, WEEKDAYS } from './calendar'

describe('calendar', () => {
  it('WEEKDAYS empieza en lunes', () => {
    expect(WEEKDAYS[0]).toBe('lun')
    expect(WEEKDAYS).toHaveLength(7)
  })

  it('agosto 2026 (sáb 1) comienza con 5 celdas vacías y tiene sáb 1 en la columna 5', () => {
    const weeks = getMonthGrid(2026, 7)
    expect(weeks.flat().length % 7).toBe(0)
    expect(weeks[0][0]).toBeNull()
    expect(weeks[0][5]?.getDate()).toBe(1)
  })

  it('febrero 2024 es bisiesto con 29 días', () => {
    const days = getMonthGrid(2024, 1).flat().filter(Boolean)
    expect(days).toHaveLength(29)
  })

  it('todas las semanas tienen exactamente 7 celdas', () => {
    const weeks = getMonthGrid(2025, 0)
    weeks.forEach((w) => expect(w).toHaveLength(7))
  })

  it('isSameDay compara día, mes y año', () => {
    expect(isSameDay(new Date(2026, 7, 1), new Date(2026, 7, 1))).toBe(true)
    expect(isSameDay(new Date(2026, 7, 1), new Date(2026, 7, 2))).toBe(false)
    expect(isSameDay(new Date(2026, 7, 1), new Date(2026, 6, 1))).toBe(false)
    expect(isSameDay(new Date(2026, 7, 1), new Date(2025, 7, 1))).toBe(false)
  })
})