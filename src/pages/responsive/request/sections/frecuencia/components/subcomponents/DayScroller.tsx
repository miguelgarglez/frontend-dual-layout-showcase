import { type RefObject, useMemo, type KeyboardEvent } from 'react'

import Button from '@components/ui/Button'
import { cn } from '@lib/utils/cn'

import {
  formatDateKey,
  longWeekdayLabels,
  monthLabels,
  shortWeekdayLabels,
} from '../calendarUtils'

type VisibleMonthDetails = {
  label: string
  year: number
}

type DayScrollerProps = {
  calendarDays: Date[]
  scrollerRef: RefObject<HTMLDivElement | null>
  registerDayRef: (key: string, node: HTMLButtonElement | null) => void
  normalizedSelectedDateKey: string
  onSelectDay: (date: Date) => void
  visibleMonthDetails: VisibleMonthDetails
}

const DayScroller = ({
  calendarDays,
  scrollerRef,
  registerDayRef,
  normalizedSelectedDateKey,
  onSelectDay,
  visibleMonthDetails,
}: DayScrollerProps) => {
  const dayIndexLookup = useMemo(() => {
    const lookup = new Map<string, number>()
    calendarDays.forEach((date, index) => {
      lookup.set(formatDateKey(date), index)
    })
    return lookup
  }, [calendarDays])

  const activeDescendantId = useMemo(
    () => `day-option-${normalizedSelectedDateKey}`,
    [normalizedSelectedDateKey],
  )

  const selectDay = (date: Date) => {
    onSelectDay(date)
  }

  const moveSelection = (offset: number) => {
    const currentIndex = dayIndexLookup.get(normalizedSelectedDateKey)
    if (currentIndex === undefined) {
      return
    }

    const nextIndex = currentIndex + offset
    if (nextIndex < 0 || nextIndex >= calendarDays.length) {
      return
    }

    const nextDate = calendarDays[nextIndex]
    if (nextDate) {
      selectDay(nextDate)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveSelection(-1)
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveSelection(1)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      const firstDate = calendarDays[0]
      if (firstDate) {
        selectDay(firstDate)
      }
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      const lastDate = calendarDays[calendarDays.length - 1]
      if (lastDate) {
        selectDay(lastDate)
      }
    }
  }

  return (
    <div
      ref={scrollerRef}
      role="listbox"
      tabIndex={0}
      aria-activedescendant={activeDescendantId}
      aria-label={`Select a day in ${visibleMonthDetails.label} ${visibleMonthDetails.year}`}
      className="focus-outline-brand flex gap-2 overflow-x-auto pb-1"
      onKeyDown={handleKeyDown}
    >
      {calendarDays.map((date) => {
        const key = formatDateKey(date)
        const isSelected = key === normalizedSelectedDateKey
        const weekdayIndex = date.getDay()

        return (
          <Button
            key={key}
            id={`day-option-${key}`}
            ref={(node) => registerDayRef(key, node)}
            type="button"
            tabIndex={-1}
            role="option"
            aria-selected={isSelected}
            aria-label={`${longWeekdayLabels[weekdayIndex]} ${date.getDate()} of ${monthLabels[date.getMonth()]}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectDay(date)}
            variant="secondaryClient"
            className={cn(
              'flex min-w-14 flex-col items-center gap-1 rounded-lg px-3 py-2 text-center transition-colors',
              isSelected
                ? 'border-client-100 bg-client-40 text-client-100'
                : '',
            )}
          >
            <span
              className={cn(
                'text-base tracking-wide',
                isSelected ? 'text-client-100' : 'text-greyscale-110',
              )}
            >
              {shortWeekdayLabels[weekdayIndex]}
            </span>
            <span
              className={cn(
                'text-lg leading-none font-medium',
                isSelected ? 'text-client-100' : 'text-greyscale-140',
              )}
            >
              {date.getDate()}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default DayScroller
