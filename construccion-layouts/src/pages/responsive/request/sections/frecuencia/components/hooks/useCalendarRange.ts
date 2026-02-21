import { useMemo } from 'react'

import {
  MONTHS_AFTER_START,
  DAYS_BEFORE_START,
  buildCalendarDays,
  formatDateKey,
  formatMonthKey,
  monthLabels,
} from '../calendarUtils'

export type MonthOption = {
  key: string
  month: number
  year: number
  label: string
}

export type MonthAnchor = { monthKey: string; dayKey: string }

type UseCalendarRangeResult = {
  calendarDays: Date[]
  availableMonths: MonthOption[]
  monthAnchors: MonthAnchor[]
  selectedMonthKey: string
  normalizedSelectedDateKey: string
}

const getStartOfDay = (date: Date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const addDays = (date: Date, amount: number) => {
  const shifted = new Date(date)
  shifted.setDate(shifted.getDate() + amount)
  return shifted
}

const buildRangeEndFrom = (anchor: Date) => {
  const end = new Date(anchor)
  end.setMonth(end.getMonth() + MONTHS_AFTER_START + 1, 0)
  end.setHours(0, 0, 0, 0)
  return end
}

const useCalendarRange = (selectedDate: Date): UseCalendarRangeResult => {
  const rangeBoundaries = useMemo(() => {
    // Recompute the visible window whenever the controlled selection changes so we never
    // hide server-hydrated dates or selections that drift after leaving the UI open.
    const today = getStartOfDay(new Date())

    const defaultRangeStart = addDays(today, -DAYS_BEFORE_START)
    const defaultRangeEnd = buildRangeEndFrom(today)

    const normalizedSelectedDate = getStartOfDay(selectedDate)

    const rangeStartDate =
      normalizedSelectedDate < defaultRangeStart
        ? addDays(normalizedSelectedDate, -DAYS_BEFORE_START)
        : defaultRangeStart

    const rangeEndDate =
      normalizedSelectedDate > defaultRangeEnd
        ? buildRangeEndFrom(normalizedSelectedDate)
        : defaultRangeEnd

    return { rangeStartDate, rangeEndDate }
  }, [selectedDate])

  const { rangeStartDate, rangeEndDate } = rangeBoundaries

  const calendarDays = useMemo(
    () => buildCalendarDays(rangeStartDate, rangeEndDate),
    [rangeStartDate, rangeEndDate],
  )

  const availableMonths = useMemo(() => {
    const monthsMap = new Map<string, MonthOption>()

    calendarDays.forEach((date) => {
      const key = formatMonthKey(date)
      if (monthsMap.has(key)) {
        return
      }

      monthsMap.set(key, {
        key,
        month: date.getMonth(),
        year: date.getFullYear(),
        label: `${monthLabels[date.getMonth()]} ${date.getFullYear()}`,
      })
    })

    return Array.from(monthsMap.values())
  }, [calendarDays])

  const selectedMonthKey = useMemo(
    () => formatMonthKey(selectedDate),
    [selectedDate],
  )

  const normalizedSelectedDateKey = useMemo(
    () => formatDateKey(selectedDate),
    [selectedDate],
  )

  const monthAnchors = useMemo(() => {
    const anchors: MonthAnchor[] = []
    const seen = new Set<string>()

    calendarDays.forEach((date) => {
      const monthKey = formatMonthKey(date)
      if (seen.has(monthKey)) {
        return
      }

      seen.add(monthKey)
      anchors.push({ monthKey, dayKey: formatDateKey(date) })
    })

    return anchors
  }, [calendarDays])

  return {
    calendarDays,
    availableMonths,
    monthAnchors,
    selectedMonthKey,
    normalizedSelectedDateKey,
  }
}

export default useCalendarRange
