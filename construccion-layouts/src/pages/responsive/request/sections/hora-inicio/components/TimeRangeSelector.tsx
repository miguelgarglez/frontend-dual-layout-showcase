import Button from '@components/ui/Button'
import { cn } from '@lib/utils/cn'
import type { LucideIcon } from 'lucide-react'
import { MoonStar, Sun, Sunrise, Sunset } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import {
  timeRangeGroups,
  type TimeRangeIconId,
} from '../../../context/timeRangeData'
// Reading ranges from context/ keeps this component purely presentational.

const iconMap: Record<TimeRangeIconId, LucideIcon> = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moonStar: MoonStar,
}

const orderedRangeIds = timeRangeGroups.flatMap((group) =>
  group.ranges.map((range) => range.id),
)
const firstRangeId = orderedRangeIds[0]

type TimeRangeSelectorProps = {
  selectedRangeId: string
  onSelectRange: (rangeId: string) => void
}

const TimeRangeSelector = ({
  selectedRangeId,
  onSelectRange,
}: TimeRangeSelectorProps) => {
  // Radio-group navigation ensures a single tab stop while still letting arrows jump between options for screen-reader parity.
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentRangeId: string,
  ) => {
    if (!orderedRangeIds.length) return

    const currentIndex = orderedRangeIds.indexOf(currentRangeId)
    if (currentIndex === -1) return

    const { key } = event
    const isPreviousKey = key === 'ArrowLeft' || key === 'ArrowUp'
    const isNextKey = key === 'ArrowRight' || key === 'ArrowDown'
    const isHomeKey = key === 'Home'
    const isEndKey = key === 'End'

    if (!isPreviousKey && !isNextKey && !isHomeKey && !isEndKey) return

    event.preventDefault()
    event.stopPropagation()

    let targetIndex = currentIndex
    if (isPreviousKey) {
      targetIndex = (currentIndex - 1 + orderedRangeIds.length) % orderedRangeIds.length
    } else if (isNextKey) {
      targetIndex = (currentIndex + 1) % orderedRangeIds.length
    } else if (isHomeKey) {
      targetIndex = 0
    } else if (isEndKey) {
      targetIndex = orderedRangeIds.length - 1
    }

    const targetRangeId = orderedRangeIds[targetIndex]
    if (targetRangeId === currentRangeId) return

    onSelectRange(targetRangeId)

    const container = event.currentTarget.closest(
      '[data-time-range-selector="group"]',
    ) as HTMLElement | null
    const nextButton = container?.querySelector<HTMLButtonElement>(
      `[data-range-id="${targetRangeId}"]`,
    )

    if (nextButton) {
      requestAnimationFrame(() => {
        nextButton.focus()
      })
    }
  }

  return (
    <div
      className="space-y-6"
      role="radiogroup"
      aria-label="Selecciona una franja horaria"
      data-time-range-selector="group"
    >
      {timeRangeGroups.map((group) => (
        <div key={group.label} className="space-y-3">
          <p className="text-greyscale-120 text-xs font-normal">{group.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {group.ranges.map((range) => {
              const Icon = iconMap[range.icon]
              const isSelected = range.id === selectedRangeId
              const tabIndex =
                isSelected || (!selectedRangeId && range.id === firstRangeId)
                  ? 0
                  : -1

              return (
                <Button
                  key={range.id}
                  type="button"
                  fullWidth
                  variant="secondaryClient"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={tabIndex}
                  data-range-id={range.id}
                  onClick={() => onSelectRange(range.id)}
                  onKeyDown={(event) => handleKeyDown(event, range.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-center text-sm font-semibold',
                    isSelected
                      ? 'border-client-100 bg-client-40 text-client-100'
                      : 'text-greyscale-140',
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-client-100' : 'text-greyscale-140',
                    )}
                    strokeWidth={1.5}
                  />
                  <span className="text-base leading-tight">{range.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimeRangeSelector
