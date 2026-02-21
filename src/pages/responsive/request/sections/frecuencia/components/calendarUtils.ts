export const shortWeekdayLabels = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const

export const longWeekdayLabels = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const DAYS_BEFORE_START = 7
export const MONTHS_AFTER_START = 6

export const buildCalendarDays = (rangeStart: Date, rangeEnd: Date) => {
  const days: Date[] = []
  const cursor = new Date(rangeStart)

  while (cursor <= rangeEnd) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

export const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`

export const parseMonthKey = (key: string) => {
  const [year, month] = key.split('-').map(Number)
  return { year, month }
}

export const getInitialSelectedDate = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const parseDateKey = (
  key: string | undefined,
  fallbackDate: Date,
) => {
  if (!key) {
    return new Date(fallbackDate)
  }

  const [rawYear, rawMonth, rawDay] = key.split('-').map(Number)
  if ([rawYear, rawMonth, rawDay].some((value) => Number.isNaN(value))) {
    return new Date(fallbackDate)
  }

  const parsedDate = new Date(rawYear, rawMonth - 1, rawDay)
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(fallbackDate)
  }

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}
