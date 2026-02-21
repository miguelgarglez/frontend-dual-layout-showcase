import type { RefObject } from 'react'

import SectionHeader from '@components/layout/SectionHeader'
import Button from '@components/ui/Button'

type MonthHeaderProps = {
  currentMonthLabel: string
  isMonthPickerOpen: boolean
  onOpenMonthPicker: () => void
  monthPickerTriggerRef: RefObject<HTMLButtonElement | null>
}

const MonthHeader = ({
  currentMonthLabel,
  isMonthPickerOpen,
  onOpenMonthPicker,
  monthPickerTriggerRef,
}: MonthHeaderProps) => (
  <SectionHeader
    headingTone="neutral"
    headingLevel={3}
    titleSpacing="compact"
    title={currentMonthLabel}
    titleAddon={
      <Button
        type="button"
        variant="secondaryClient"
        size="md"
        className="ml-auto px-4 py-2 text-xs font-semibold"
        aria-label="Open month picker"
        aria-haspopup="dialog"
        aria-expanded={isMonthPickerOpen}
        ref={monthPickerTriggerRef}
        onClick={onOpenMonthPicker}
      >
        Show month
      </Button>
    }
  />
)

export default MonthHeader
