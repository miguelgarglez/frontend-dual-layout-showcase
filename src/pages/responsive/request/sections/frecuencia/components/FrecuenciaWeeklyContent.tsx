import { useMemo } from 'react'
import SectionHeader from '@components/layout/SectionHeader'
import Button from '@components/ui/Button'
import { cn } from '@lib/utils/cn'
import type { WeekdayValue } from '../../../context/ResponsiveRequestFormContext'

const weekDays = [
  { label: 'Mon', value: 'mon' },
  { label: 'Tue', value: 'tue' },
  { label: 'Wed', value: 'wed' },
  { label: 'Thu', value: 'thu' },
  { label: 'Fri', value: 'fri' },
  { label: 'Sat', value: 'sat' },
  { label: 'Sun', value: 'sun' },
] as const

type FrecuenciaWeeklyContentProps = {
  selectedDays: WeekdayValue[]
  onChangeSelectedDays: (next: WeekdayValue[]) => void
}

const FrecuenciaWeeklyContent = ({
  selectedDays,
  onChangeSelectedDays,
}: FrecuenciaWeeklyContentProps) => {
  const selectedDaysSet = useMemo(() => new Set(selectedDays), [selectedDays])

  const toggleDay = (dayValue: WeekdayValue) => {
    const nextSelected = new Set(selectedDays)
    if (nextSelected.has(dayValue)) {
      nextSelected.delete(dayValue)
    } else {
      nextSelected.add(dayValue)
    }
    const orderedSelection = weekDays
      .map((day) => day.value)
      .filter((value) => nextSelected.has(value))
    onChangeSelectedDays(orderedSelection)
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        headingTone="neutral"
        headingLevel={3}
        titleSpacing="compact"
        title="Day(s) of the week"
      />
      <div
        className="grid grid-cols-4 gap-2 sm:grid-cols-7"
        role="group"
        aria-label="Select weekdays"
      >
        {weekDays.map((day) => {
          const isSelected = selectedDaysSet.has(day.value)

          return (
            <Button
              key={day.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleDay(day.value)}
              variant="secondaryClient"
              className={cn(
                'h-10 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-client-100 bg-client-40 text-client-100'
                  : '',
              )}
            >
              {day.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default FrecuenciaWeeklyContent
