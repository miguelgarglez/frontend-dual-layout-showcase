import { useId, useMemo, useRef, useState } from 'react'

import {
  formatDateKey,
  formatMonthKey,
  getInitialSelectedDate,
  monthLabels,
  parseDateKey,
  parseMonthKey,
} from './calendarUtils'
import useCalendarRange from './hooks/useCalendarRange'
import useMonthScroller from './hooks/useMonthScroller'
import DayScroller from './subcomponents/DayScroller'
import MonthHeader from './subcomponents/MonthHeader'
import MonthPicker from './subcomponents/MonthPicker'

type FrecuenciaSingleContentProps = {
  selectedDateKey: string
  onSelectDate: (dateKey: string) => void
}

const FrecuenciaSingleContent = ({
  selectedDateKey,
  onSelectDate,
}: FrecuenciaSingleContentProps) => {
  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey, getInitialSelectedDate()),
    [selectedDateKey],
  )

  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false)
  const monthPickerHeadingId = useId()
  const monthPickerTriggerRef = useRef<HTMLButtonElement | null>(null)

  const {
    calendarDays,
    availableMonths,
    monthAnchors,
    selectedMonthKey,
    normalizedSelectedDateKey,
  } = useCalendarRange(selectedDate)

  const { visibleMonthKey, setVisibleMonthKey, scrollerRef, registerDayRef } =
    useMonthScroller({
      selectedDate,
      normalizedSelectedDateKey,
      monthAnchors,
    })

  const visibleMonthDetails = useMemo(() => {
    const { year, month } = parseMonthKey(visibleMonthKey)
    const safeMonth = Number.isNaN(month) ? selectedDate.getMonth() : month
    const safeYear = Number.isNaN(year)
      ? selectedDate.getFullYear()
      : year

    return {
      year: safeYear,
      month: safeMonth,
      label: monthLabels[safeMonth],
    }
  }, [selectedDate, visibleMonthKey])

  const currentMonthLabel = visibleMonthDetails.label

  const handleSelectDay = (date: Date) => {
    onSelectDate(formatDateKey(date))
    setVisibleMonthKey(formatMonthKey(date))
  }

  const closeMonthPicker = () => setMonthPickerOpen(false)

  const handleMonthSelect = (monthKey: string) => {
    const { year, month } = parseMonthKey(monthKey)
    const targetMonthTotalDays = new Date(year, month + 1, 0).getDate()
    const safeDay = Math.min(selectedDate.getDate(), targetMonthTotalDays)
    onSelectDate(formatDateKey(new Date(year, month, safeDay)))
    setVisibleMonthKey(monthKey)
    closeMonthPicker()
  }

  return (
    <div className="space-y-4">
      <MonthHeader
        currentMonthLabel={currentMonthLabel}
        isMonthPickerOpen={isMonthPickerOpen}
        onOpenMonthPicker={() => setMonthPickerOpen(true)}
        monthPickerTriggerRef={monthPickerTriggerRef}
      />

      <DayScroller
        calendarDays={calendarDays}
        scrollerRef={scrollerRef}
        registerDayRef={registerDayRef}
        normalizedSelectedDateKey={normalizedSelectedDateKey}
        onSelectDay={handleSelectDay}
        visibleMonthDetails={{
          label: currentMonthLabel,
          year: visibleMonthDetails.year,
        }}
      />

      <MonthPicker
        open={isMonthPickerOpen}
        onClose={closeMonthPicker}
        months={availableMonths}
        selectedMonthKey={selectedMonthKey}
        onSelectMonth={handleMonthSelect}
        monthPickerHeadingId={monthPickerHeadingId}
        monthPickerTriggerRef={monthPickerTriggerRef}
      />
    </div>
  )
}

export default FrecuenciaSingleContent
