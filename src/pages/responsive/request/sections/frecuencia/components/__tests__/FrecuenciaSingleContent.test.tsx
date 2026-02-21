import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { useState } from 'react'

import FrecuenciaSingleContent from '../FrecuenciaSingleContent'

const ControlledFrecuencia = ({
  initialKey,
  onSelect,
}: {
  initialKey: string
  onSelect: (value: string) => void
}) => {
  const [value, setValue] = useState(initialKey)

  return (
    <FrecuenciaSingleContent
      selectedDateKey={value}
      onSelectDate={(next) => {
        setValue(next)
        onSelect(next)
      }}
    />
  )
}

const originalScrollIntoView = Element.prototype.scrollIntoView
const RealDate = Date

const setMockDate = (mocked: Date) => {
  const fixedTime = mocked.getTime()

  class MockDate extends RealDate {
    constructor(...args: ConstructorParameters<typeof RealDate>) {
      const hasArgs = (args as unknown[]).length > 0
      if (!hasArgs) {
        super(fixedTime)
      } else {
        super(...args)
      }
    }

    static override now() {
      return fixedTime
    }
  }

  // @ts-expect-error override Date for deterministic tests
  globalThis.Date = MockDate
}

const restoreDateMock = () => {
  globalThis.Date = RealDate
}

describe('FrecuenciaSingleContent', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterAll(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    setMockDate(new RealDate(2025, 0, 10))
  })

  afterEach(() => {
    document.body.style.overflow = ''
    restoreDateMock()
    vi.clearAllMocks()
  })

  it('calls onSelectDate when picking another day', async () => {
    const handleSelect = vi.fn()
    const user = userEvent.setup()

    render(
      <ControlledFrecuencia initialKey="2025-01-08" onSelect={handleSelect} />,
    )

    expect(screen.getByText('January')).toBeInTheDocument()
    const selectedOption = screen.getByRole('option', {
      name: /wednesday 8 of january/i,
    })
    expect(selectedOption).toHaveAttribute('aria-selected', 'true')

    const nextDay = screen.getByRole('option', {
      name: /thursday 9 of january/i,
    })
    await user.click(nextDay)

    expect(handleSelect).toHaveBeenCalledWith('2025-01-09')
  })

  it('updates the selected date when choosing another month from the picker', async () => {
    const handleSelect = vi.fn()
    const user = userEvent.setup()

    render(
      <ControlledFrecuencia initialKey="2025-01-08" onSelect={handleSelect} />,
    )

    await user.click(
      screen.getByRole('button', { name: /open month picker/i }),
    )
    const julyButton = await screen.findByRole('button', { name: 'July 2025' })
    await user.click(julyButton)

    expect(handleSelect).toHaveBeenCalledWith('2025-07-08')
  })

  it('supports arrow-key day navigation while preserving listbox semantics', async () => {
    const handleSelect = vi.fn()
    const user = userEvent.setup()

    render(
      <ControlledFrecuencia initialKey="2025-01-08" onSelect={handleSelect} />,
    )

    await user.tab()
    await user.tab()

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(handleSelect).toHaveBeenLastCalledWith('2025-01-09')
    await waitFor(() => {
      expect(listbox).toHaveAttribute(
        'aria-activedescendant',
        'day-option-2025-01-09',
      )
    })

    await user.keyboard('{ArrowLeft}')
    expect(handleSelect).toHaveBeenLastCalledWith('2025-01-08')
    await waitFor(() => {
      expect(listbox).toHaveAttribute(
        'aria-activedescendant',
        'day-option-2025-01-08',
      )
    })
  })
})
