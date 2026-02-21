import { act, fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  useSelectableValues,
  useValueNormalizer,
} from '../useWheelOptions'
import { useWheelMetrics, type WheelMetricsRefs } from '../useWheelMetrics'
import { useWheelSelection } from '../useWheelSelection'

type SelectionHarnessProps = {
  values: string[]
  selectedValue: string
  onSelect: (value: string) => void
  onReady?: (payload: {
    metrics: WheelMetricsRefs
    selection: ReturnType<typeof useWheelSelection>
  }) => void
}

const SelectionHarness = ({
  values,
  selectedValue,
  onSelect,
  onReady,
}: SelectionHarnessProps) => {
  const selectableValues = useSelectableValues(values)
  const normalizeValue = useValueNormalizer(selectableValues)
  const containerNodeRef = useRef<HTMLDivElement | null>(null)
  const metrics = useWheelMetrics(values, { containerRef: containerNodeRef })
  const selection = useWheelSelection({
    selectedValue,
    onSelect,
    normalizeValue,
    ...metrics,
  })

  useEffect(() => {
    onReady?.({ metrics, selection })
  }, [metrics, onReady, selection])

  return (
    <div
      data-testid="wheel-container"
      ref={containerNodeRef}
      onScroll={selection.handleScroll}
    >
      {values.map((value, index) =>
        value ? (
          <button
            key={`${value}-${index}`}
            data-value={value}
            onKeyDown={selection.handleButtonKeyDown}
            onClick={() => {
              selection.clearPendingSelection()
              onSelect(value)
            }}
          >
            {value}
          </button>
        ) : (
          <div key={`spacer-${index}`} />
        ),
      )}
    </div>
  )
}

const wheelValues = ['', '00', '05', '10', '']

type HarnessHandle = {
  metrics: WheelMetricsRefs
  selection: ReturnType<typeof useWheelSelection>
}

const assignButtonMetrics = async (metrics: WheelMetricsRefs) => {
  const buttons =
    screen.getByTestId('wheel-container').querySelectorAll<HTMLButtonElement>(
      'button[data-value]',
    )

  buttons.forEach((button, index) => {
    Object.defineProperty(button, 'offsetTop', {
      value: index * 40,
      configurable: true,
    })
    Object.defineProperty(button, 'offsetHeight', {
      value: 40,
      configurable: true,
    })
  })

  await act(async () => {
    metrics.measureButtonMetrics()
  })
}

describe('useWheelSelection', () => {
  const originalRAF = window.requestAnimationFrame
  const originalCAF = window.cancelAnimationFrame
  const originalScrollTo = Element.prototype.scrollTo
  const originalResizeObserver = globalThis.ResizeObserver

  beforeEach(() => {
    vi.useFakeTimers()
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    window.cancelAnimationFrame = () => {}
    Element.prototype.scrollTo = vi.fn()
    // Force fallback path for deterministic behavior.
    // @ts-expect-error - we intentionally remove ResizeObserver for the suite.
    globalThis.ResizeObserver = undefined
  })

  afterEach(() => {
    vi.useRealTimers()
    window.requestAnimationFrame = originalRAF
    window.cancelAnimationFrame = originalCAF
    Element.prototype.scrollTo = originalScrollTo
    if (typeof originalResizeObserver === 'undefined') {
      // @ts-expect-error cleanup override
      delete globalThis.ResizeObserver
    } else {
      globalThis.ResizeObserver = originalResizeObserver
    }
  })

  const flushEffects = async () => {
    await act(async () => {
      await Promise.resolve()
    })
  }

  it('normalizes invalid selections once on mount', async () => {
    const handleSelect = vi.fn()
    render(
      <SelectionHarness
        values={wheelValues}
        selectedValue="12"
        onSelect={handleSelect}
      />,
    )

    await flushEffects()

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith('10')
  })

  it('flushes pending selection after the scroll settles', async () => {
    const handleSelect = vi.fn()
    let harnessHandle: HarnessHandle | null = null

    render(
      <SelectionHarness
        values={wheelValues}
        selectedValue="00"
        onSelect={handleSelect}
        onReady={(payload) => {
          harnessHandle = payload
        }}
      />,
    )

    await flushEffects()
    expect(harnessHandle).not.toBeNull()

    await assignButtonMetrics(harnessHandle!.metrics)

    const container = screen.getByTestId('wheel-container') as HTMLDivElement
    Object.defineProperty(container, 'clientHeight', {
      value: 160,
      configurable: true,
    })

    await act(async () => {
      container.scrollTop = 20
      container.dispatchEvent(new Event('scroll'))
    })

    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(handleSelect).toHaveBeenCalledWith('10')
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation', async () => {
    const handleSelect = vi.fn()
    let harnessHandle: HarnessHandle | null = null

    render(
      <SelectionHarness
        values={wheelValues}
        selectedValue="05"
        onSelect={handleSelect}
        onReady={(payload) => {
          harnessHandle = payload
        }}
      />,
    )

    await flushEffects()
    expect(harnessHandle).not.toBeNull()

    await assignButtonMetrics(harnessHandle!.metrics)

    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find(
      (button) => button.textContent === '05',
    ) as HTMLButtonElement

    await act(async () => {
      activeButton.focus()
    })

    await act(async () => {
      fireEvent.keyDown(activeButton, { key: 'ArrowDown' })
    })

    expect(handleSelect).toHaveBeenCalledWith('10')
  })
})
