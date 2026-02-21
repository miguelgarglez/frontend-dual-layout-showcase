import { describe, expect, it } from 'vitest'

import {
  formatDateKey,
  formatMonthKey,
  getInitialSelectedDate,
  parseDateKey,
} from '../calendarUtils'

describe('calendarUtils', () => {
  it('parses valid date keys at midnight local time', () => {
    const fallback = new Date(2025, 0, 5)
    fallback.setHours(0, 0, 0, 0)

    const parsed = parseDateKey('2025-03-15', fallback)

    expect(formatDateKey(parsed)).toBe('2025-03-15')
    expect(parsed.getHours()).toBe(0)
    expect(parsed.getMinutes()).toBe(0)
  })

  it('falls back to the provided date when parsing fails', () => {
    const fallback = getInitialSelectedDate()
    const parsed = parseDateKey('invalid-key', fallback)

    expect(formatDateKey(parsed)).toBe(formatDateKey(fallback))
    expect(parsed).not.toBe(fallback)
  })

  it('formats month keys in YYYY-MM notation with zero padding', () => {
    const date = new Date(2025, 0, 15)
    expect(formatMonthKey(date)).toBe('2025-00')
  })
})
