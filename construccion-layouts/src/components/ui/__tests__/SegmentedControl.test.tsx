import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import SegmentedControl from '../SegmentedControl'

type ModeOption = {
  value: 'range' | 'exact' | 'mixed'
  title: string
}

const baseOptions: ModeOption[] = [
  { value: 'range', title: 'Inicio flexible' },
  { value: 'exact', title: 'Inicio exacto' },
  { value: 'mixed', title: 'Inicio mixto' },
]

const segmentedOptions = baseOptions.map((option) => ({
  ...option,
  tabId: `segmented-tab-${option.value}`,
  panelId: `segmented-panel-${option.value}`,
}))

const SegmentedControlHarness = ({
  initialValue = 'range',
  onChange,
}: {
  initialValue?: ModeOption['value']
  onChange?: (value: ModeOption['value']) => void
}) => {
  const [value, setValue] = useState<ModeOption['value']>(initialValue)

  return (
    <>
      <SegmentedControl
        ariaLabel="Tipo de hora de inicio"
        value={value}
        options={segmentedOptions}
        onChange={(nextValue) => {
          setValue(nextValue)
          onChange?.(nextValue)
        }}
        renderOptionContent={(option) => option.title}
      />
      <span data-testid="selected-value">{value}</span>
    </>
  )
}

describe('SegmentedControl', () => {
  it('calls onChange and updates selection when clicking a different tab', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SegmentedControlHarness onChange={handleChange} />)

    const exactTab = screen.getByRole('tab', { name: 'Inicio exacto' })
    expect(exactTab).toHaveAttribute('aria-selected', 'false')

    await user.click(exactTab)

    expect(handleChange).toHaveBeenCalledWith('exact')
    expect(exactTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('selected-value')).toHaveTextContent('exact')
  })

  it('supports keyboard navigation between tabs and selection via Enter', async () => {
    const user = userEvent.setup()

    render(<SegmentedControlHarness />)

    const tabs = screen.getAllByRole('tab')
    await user.tab()
    expect(tabs[0]).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('tabindex', '0')
    expect(tabs[0]).toHaveAttribute('tabindex', '-1')
    expect(screen.getByTestId('selected-value')).toHaveTextContent('range')

    await user.keyboard('{Enter}')
    expect(screen.getByTestId('selected-value')).toHaveTextContent('exact')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(tabs[2]).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(tabs[0]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(tabs[0]).toHaveFocus()
  })
})
