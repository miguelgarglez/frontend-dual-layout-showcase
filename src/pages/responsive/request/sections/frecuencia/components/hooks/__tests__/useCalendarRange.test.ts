import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatDateKey } from '../../calendarUtils'
import useCalendarRange from '../useCalendarRange'

describe('useCalendarRange', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 10))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('builds the calendar days within the configured range and exposes month data', () => {
    const selectedDate = new Date(2025, 0, 8)
    selectedDate.setHours(0, 0, 0, 0)

    const { result } = renderHook(() => useCalendarRange(selectedDate))

    const { calendarDays, availableMonths, monthAnchors, selectedMonthKey, normalizedSelectedDateKey } =
      result.current

    expect(calendarDays).toHaveLength(210)
    expect(formatDateKey(calendarDays[0]!)).toBe('2025-01-03')
    expect(formatDateKey(calendarDays.at(-1)!)).toBe('2025-07-31')

    expect(availableMonths).toHaveLength(7)
    expect(availableMonths[0]).toMatchObject({
      key: '2025-00',
      label: 'January 2025',
    })
    expect(availableMonths.at(-1)).toMatchObject({
      key: '2025-06',
      label: 'July 2025',
    })

    expect(monthAnchors[0]).toEqual({ monthKey: '2025-00', dayKey: '2025-01-03' })
    expect(monthAnchors.at(-1)).toEqual({ monthKey: '2025-06', dayKey: '2025-07-01' })

    expect(selectedMonthKey).toBe('2025-00')
    expect(normalizedSelectedDateKey).toBe('2025-01-08')
  })

  it('extends the range backwards when the selected date predates the default start', () => {
    const selectedDate = new Date(2024, 0, 1)
    selectedDate.setHours(0, 0, 0, 0)

    const { result } = renderHook(() => useCalendarRange(selectedDate))

    const { calendarDays, normalizedSelectedDateKey } = result.current

    expect(formatDateKey(calendarDays[0]!)).toBe('2023-12-25')
    expect(formatDateKey(calendarDays.at(-1)!)).toBe('2025-07-31')
    expect(normalizedSelectedDateKey).toBe('2024-01-01')
  })

  it('extends the range forward when the selected date exceeds the default end', () => {
    const selectedDate = new Date(2025, 11, 25)
    selectedDate.setHours(0, 0, 0, 0)

    const { result } = renderHook(() => useCalendarRange(selectedDate))

    const {
      calendarDays,
      availableMonths,
      normalizedSelectedDateKey,
    } = result.current

    expect(formatDateKey(calendarDays[0]!)).toBe('2025-01-03')
    expect(formatDateKey(calendarDays.at(-1)!)).toBe('2026-06-30')
    expect(availableMonths.at(-1)).toMatchObject({
      key: '2026-05',
      label: 'June 2026',
    })
    expect(normalizedSelectedDateKey).toBe('2025-12-25')
  })
})
