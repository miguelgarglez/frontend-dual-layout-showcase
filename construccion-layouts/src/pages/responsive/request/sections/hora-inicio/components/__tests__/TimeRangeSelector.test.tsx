import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TimeRangeSelector from '../TimeRangeSelector'
import {
  ResponsiveRequestFormProvider,
  useResponsiveRequestForm,
} from '../../../../context/ResponsiveRequestFormContext'
import { buildInitialState } from '../../../../context/responsiveRequestFormState'
import { timeRangeGroups } from '../../../../context/timeRangeData'

const TimeRangeSelectorWithContext = () => {
  const {
    state: { timeRangeId },
    actions: { setTimeRangeId },
  } = useResponsiveRequestForm()

  return (
    <>
      <TimeRangeSelector
        selectedRangeId={timeRangeId}
        onSelectRange={setTimeRangeId}
      />
      <span data-testid="selected-range">{timeRangeId}</span>
    </>
  )
}

const buildInitialFormState = () => {
  const initialState = buildInitialState()
  // Start on the first range to ensure the test picks a different option.
  const firstRangeId = timeRangeGroups[0]?.ranges[0]?.id ?? 'range-06-09'
  return {
    ...initialState,
    timeRangeId: firstRangeId,
  }
}

describe('TimeRangeSelector', () => {
  it('notifies the context action when selecting a different range', async () => {
    const user = userEvent.setup()
    const initialState = buildInitialFormState()
    render(
      <ResponsiveRequestFormProvider initialState={initialState}>
        <TimeRangeSelectorWithContext />
      </ResponsiveRequestFormProvider>,
    )

    const nextRange = timeRangeGroups[0]?.ranges[1]
    if (!nextRange) {
      throw new Error('Expected at least two ranges')
    }

    const nextRangeButton = screen.getByRole('radio', {
      name: nextRange.label,
    })
    expect(nextRangeButton).toHaveAttribute('aria-checked', 'false')

    await user.click(nextRangeButton)

    expect(nextRangeButton).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('selected-range')).toHaveTextContent(nextRange.id)
  })
})
