import { act, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import { describe, expect, it } from 'vitest'

import {
  useWheelMetrics,
  type WheelMetricsRefs,
} from '../useWheelMetrics'

type MetricsHarnessProps = {
  values: string[]
  onReady: (metrics: WheelMetricsRefs) => void
}

const MetricsHarness = ({ values, onReady }: MetricsHarnessProps) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null)
  const metrics = useWheelMetrics(values, { containerRef: containerNodeRef })

  useEffect(() => {
    onReady(metrics)
  }, [metrics, onReady])

  return (
    <div data-testid="wheel-container" ref={containerNodeRef}>
      {values.map((value, index) =>
        value ? (
          <button key={value} data-value={value}>
            {value}
          </button>
        ) : (
          <div key={`spacer-${index}`} />
        ),
      )}
    </div>
  )
}

describe('useWheelMetrics', () => {
  const wheelValues = ['', '00', '05', '10', '']

  it('measures button spacing and caches values', async () => {
    let latestMetrics: WheelMetricsRefs | null = null
    render(
      <MetricsHarness values={wheelValues} onReady={(value) => (latestMetrics = value)} />,
    )

    await waitFor(() => {
      expect(latestMetrics).not.toBeNull()
    })

    const metrics = latestMetrics!
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

    expect(metrics.buttonValuesRef.current).toEqual(['00', '05', '10'])
    expect(metrics.metricsRef.current.firstCenter).toBe(20)
    expect(metrics.metricsRef.current.spacing).toBe(40)
  })
})
