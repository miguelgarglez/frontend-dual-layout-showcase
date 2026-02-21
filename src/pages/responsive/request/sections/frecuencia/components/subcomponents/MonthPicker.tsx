import type { RefObject } from 'react'

import Button from '@components/ui/Button'
import Popover from '@components/ui/Popover'
import { cn } from '@lib/utils/cn'

import type { MonthOption } from '../hooks/useCalendarRange'

type MonthPickerProps = {
  open: boolean
  onClose: () => void
  months: MonthOption[]
  selectedMonthKey: string
  onSelectMonth: (monthKey: string) => void
  monthPickerHeadingId: string
  monthPickerTriggerRef: RefObject<HTMLButtonElement | null>
}

const MonthPicker = ({
  open,
  onClose,
  months,
  selectedMonthKey,
  onSelectMonth,
  monthPickerHeadingId,
  monthPickerTriggerRef,
}: MonthPickerProps) => (
  <Popover
    open={open}
    onClose={onClose}
    labelledBy={monthPickerHeadingId}
    className="max-w-md"
    returnFocus={() => monthPickerTriggerRef.current}
  >
    <div className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <h3
          id={monthPickerHeadingId}
          className="text-pinned-navy text-lg font-semibold"
        >
          Select month
        </h3>
        <Button variant="link" size="inline" linkTone="navy" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {months.map((monthOption) => {
          const isActive = selectedMonthKey === monthOption.key

          return (
            <Button
              key={monthOption.key}
              type="button"
              variant="secondaryClient"
              fullWidth
              onClick={() => onSelectMonth(monthOption.key)}
              className={cn(
                'justify-start border px-4 py-3 text-left text-xs font-semibold transition-colors',
                isActive
                  ? 'border-client-100 bg-client-40 text-client-100'
                  : '',
              )}
            >
              {monthOption.label}
            </Button>
          )
        })}
      </div>
    </div>
  </Popover>
)

export default MonthPicker
