import { act, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { MonthAnchor } from '../useCalendarRange'
import useMonthScroller from '../useMonthScroller'

type HookResult = ReturnType<typeof useMonthScroller>

type HarnessProps = {
  selectedDate: Date
  normalizedSelectedDateKey: string
  monthAnchors: MonthAnchor[]
  onChange: (value: HookResult) => void
}

const ScrollerHarness = ({ onChange, ...props }: HarnessProps) => {
  const scrollerNodeRef = useRef<HTMLDivElement | null>(null)
  const hookValue = useMonthScroller({
    ...props,
    scrollerRef: scrollerNodeRef,
  })

  useEffect(() => {
    onChange(hookValue)
  }, [hookValue, onChange])

  return (
    <div>
      <div data-testid="scroller" ref={scrollerNodeRef} />
      {props.monthAnchors.map(({ dayKey }) => (
        <button
          key={dayKey}
          data-testid={`day-${dayKey}`}
          ref={(node) => hookValue.registerDayRef(dayKey, node)}
        >
          {dayKey}
        </button>
      ))}
    </div>
  )
}

const anchors: MonthAnchor[] = [
  { monthKey: '2025-00', dayKey: '2025-01-03' },
  { monthKey: '2025-01', dayKey: '2025-02-01' },
  { monthKey: '2025-05', dayKey: '2025-06-01' },
]

const januaryDate = new Date(2025, 0, 8)
januaryDate.setHours(0, 0, 0, 0)

describe('useMonthScroller', () => {
  const originalRAF = window.requestAnimationFrame
  const originalCAF = window.cancelAnimationFrame
  const originalResizeObserver = globalThis.ResizeObserver
  const originalScrollIntoView = Element.prototype.scrollIntoView

  beforeEach(() => {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    window.cancelAnimationFrame = () => {}
    Element.prototype.scrollIntoView = vi.fn()
    // Force the hook to rely on the window resize fallback for deterministic testing.
    // @ts-expect-error we intentionally hide ResizeObserver for this suite
    globalThis.ResizeObserver = undefined
  })

  afterEach(() => {
    window.requestAnimationFrame = originalRAF
    window.cancelAnimationFrame = originalCAF
    Element.prototype.scrollIntoView = originalScrollIntoView
    if (typeof originalResizeObserver === 'undefined') {
      // @ts-expect-error cleanup testing override
      delete globalThis.ResizeObserver
    } else {
      globalThis.ResizeObserver = originalResizeObserver
    }
  })

  const setupHarness = () => {
    let latestValue: HookResult | null = null
    const handleChange = (value: HookResult) => {
      latestValue = value
    }

    const renderResult = render(
      <ScrollerHarness
        selectedDate={januaryDate}
        normalizedSelectedDateKey="2025-01-08"
        monthAnchors={anchors}
        onChange={handleChange}
      />,
    )

    return { ...renderResult, getValue: () => latestValue, handleChange }
  }

  const assignOffsets = (values: Record<string, number>) => {
    Object.entries(values).forEach(([dayKey, offset]) => {
      const node = screen.getByTestId(`day-${dayKey}`)
      Object.defineProperty(node, 'offsetLeft', {
        value: offset,
        configurable: true,
      })
    })
  }

  const triggerMeasurement = async () => {
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  it('updates the visible month based on the scroll position', async () => {
    const { getValue } = setupHarness()

    await waitFor(() => {
      expect(getValue()).not.toBeNull()
    })

    const scroller = screen.getByTestId('scroller') as HTMLDivElement
    Object.defineProperty(scroller, 'clientWidth', {
      value: 400,
      configurable: true,
    })

    assignOffsets({
      '2025-01-03': 0,
      '2025-02-01': 600,
      '2025-06-01': 1200,
    })

    await triggerMeasurement()

    await waitFor(() => {
      expect(getValue()?.visibleMonthKey).toBe('2025-00')
    })

    await act(async () => {
      scroller.scrollLeft = 700
      scroller.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      expect(getValue()?.visibleMonthKey).toBe('2025-01')
    })
  })

  it('synchronizes the visible month when the selected date changes', async () => {
    const { getValue, rerender, handleChange } = setupHarness()

    await waitFor(() => {
      expect(getValue()).not.toBeNull()
    })

    const juneDate = new Date(2025, 5, 10)
    juneDate.setHours(0, 0, 0, 0)

    await act(async () => {
      rerender(
        <ScrollerHarness
          selectedDate={juneDate}
          normalizedSelectedDateKey="2025-06-10"
          monthAnchors={anchors}
          onChange={handleChange}
        />,
      )
    })

    await waitFor(() => {
      expect(getValue()?.visibleMonthKey).toBe('2025-05')
    })
  })
})
