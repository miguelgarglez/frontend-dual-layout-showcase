import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react'

type UseWheelMetricsOptions = {
  containerRef?: RefObject<HTMLDivElement | null>
}

/**
 * Measures the scroll wheel DOM to cache button order, centers, and spacing for precise scrolling math.
 */
export const useWheelMetrics = (
  values: string[],
  options?: UseWheelMetricsOptions,
) => {
  const fallbackContainerRef = useRef<HTMLDivElement | null>(null)
  const containerRef = options?.containerRef ?? fallbackContainerRef
  const buttonValuesRef = useRef<string[]>([])
  const metricsRef = useRef<{ firstCenter: number; spacing: number }>({
    firstCenter: 0,
    spacing: 0,
  })

  const measureButtonMetrics = useCallback((ref: RefObject<HTMLDivElement | null>) => {
    const container = ref.current
    if (!container) return
    const buttons =
      container.querySelectorAll<HTMLButtonElement>('button[data-value]')
    if (!buttons.length) return

    const buttonValues: string[] = []
    buttons.forEach((button) => {
      const buttonValue = button.dataset['value']
      if (buttonValue) {
        buttonValues.push(buttonValue)
      }
    })
    buttonValuesRef.current = buttonValues

    const firstButton = buttons[0]
    const firstCenter = firstButton.offsetTop + firstButton.offsetHeight / 2
    let spacing = firstButton.offsetHeight
    const secondButton = buttons[1]
    if (secondButton) {
      const secondCenter =
        secondButton.offsetTop + secondButton.offsetHeight / 2
      spacing = secondCenter - firstCenter
    }
    metricsRef.current = {
      firstCenter,
      spacing: spacing || firstButton.offsetHeight || 1,
    }
  }, [])

  const runMeasurement = useCallback(() => {
    measureButtonMetrics(containerRef)
  }, [containerRef, measureButtonMetrics])

  useLayoutEffect(() => {
    runMeasurement()

    const container = containerRef.current
    if (!container) return

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => runMeasurement())
        : null

    if (resizeObserver) {
      resizeObserver.observe(container)
    } else {
      window.addEventListener('resize', runMeasurement)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', runMeasurement)
      }
    }
  }, [containerRef, runMeasurement, values])

  return {
    containerRef,
    buttonValuesRef,
    metricsRef,
    measureButtonMetrics: runMeasurement,
  }
}

export type WheelMetricsRefs = ReturnType<typeof useWheelMetrics>
