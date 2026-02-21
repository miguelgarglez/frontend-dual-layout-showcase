import {
  type KeyboardEvent,
  type MutableRefObject,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

type WheelSelectionConfig = {
  selectedValue: string
  onSelect: (value: string) => void
  normalizeValue: (value: string | null | undefined) => string | undefined
  containerRef: RefObject<HTMLDivElement | null>
  buttonValuesRef: MutableRefObject<string[]>
  metricsRef: MutableRefObject<{ firstCenter: number; spacing: number }>
  measureButtonMetrics: () => void
}

/**
 * Coordinates scroll position, focus, and selection state for the time wheel, keeping UI feedback and reducer updates in sync.
 */
export const useWheelSelection = ({
  selectedValue,
  onSelect,
  normalizeValue,
  containerRef,
  buttonValuesRef,
  metricsRef,
  measureButtonMetrics,
}: WheelSelectionConfig) => {
  const rafRef = useRef<number | null>(null)
  const userScrollTimeoutRef = useRef<number | null>(null)
  const isUserScrollingRef = useRef(false)
  const hasInitializedRef = useRef(false)
  const pendingSelectionRef = useRef<string | null>(null)
  const [interimSelection, setInterimSelection] = useState<string | null>(null)

  const clearPendingSelection = useCallback(() => {
    pendingSelectionRef.current = null
    setInterimSelection((current) => (current === null ? current : null))
  }, [])

  const scrollToValue = useCallback(
    (value: string, animated = true) => {
      const container = containerRef.current
      if (!container) return
      const values = buttonValuesRef.current
      const currentMetrics = metricsRef.current
      if (!values.length || !currentMetrics.spacing) {
        measureButtonMetrics()
      }
      const refreshedValues = buttonValuesRef.current
      const index = refreshedValues.indexOf(value)
      if (index === -1) return
      const metrics = metricsRef.current
      if (!metrics.spacing) return
      const targetCenter = metrics.firstCenter + metrics.spacing * index
      const desiredScrollTop = targetCenter - container.clientHeight / 2
      container.scrollTo({
        top: desiredScrollTop,
        behavior: animated ? 'smooth' : 'auto',
      })
    },
    [buttonValuesRef, containerRef, measureButtonMetrics, metricsRef],
  )

  const updatePendingSelectionFromScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const { firstCenter, spacing } = metricsRef.current
    const values = buttonValuesRef.current
    if (!values.length || !spacing) {
      measureButtonMetrics()
      return
    }
    const containerCenter = container.scrollTop + container.clientHeight / 2
    const rawIndex = (containerCenter - firstCenter) / spacing
    const index = Math.round(rawIndex)
    const clampedIndex = Math.min(values.length - 1, Math.max(0, index))
    const closestValue = values[clampedIndex]
    if (closestValue && closestValue !== pendingSelectionRef.current) {
      pendingSelectionRef.current = closestValue
      setInterimSelection(closestValue)
    }
  }, [buttonValuesRef, containerRef, measureButtonMetrics, metricsRef])

  const flushPendingSelection = useCallback(() => {
    const pendingValue = pendingSelectionRef.current
    clearPendingSelection()
    if (pendingValue && pendingValue !== selectedValue) {
      onSelect(pendingValue)
    }
  }, [clearPendingSelection, onSelect, selectedValue])

  const handleScroll = useCallback(() => {
    isUserScrollingRef.current = true
    if (userScrollTimeoutRef.current !== null) {
      window.clearTimeout(userScrollTimeoutRef.current)
    }
    userScrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false
      flushPendingSelection()
    }, 140)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = window.requestAnimationFrame(
      updatePendingSelectionFromScroll,
    )
  }, [flushPendingSelection, updatePendingSelectionFromScroll])

  const normalizedSelectedValue = normalizeValue(selectedValue)

  const moveSelection = useCallback(
    (delta: number) => {
      const availableValues = buttonValuesRef.current
      if (!availableValues.length) return

      const baseValue =
        pendingSelectionRef.current ?? normalizedSelectedValue ?? availableValues[0]
      const baseIndex = baseValue ? availableValues.indexOf(baseValue) : -1
      const fallbackIndex = baseIndex === -1 ? 0 : baseIndex
      const nextIndex = Math.min(
        availableValues.length - 1,
        Math.max(0, fallbackIndex + delta),
      )
      const nextValue = availableValues[nextIndex]
      if (!nextValue) return
      clearPendingSelection()
      onSelect(nextValue)
      scrollToValue(nextValue, false)
    },
    [
      buttonValuesRef,
      clearPendingSelection,
      normalizedSelectedValue,
      onSelect,
      scrollToValue,
    ],
  )

  const handleButtonKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        moveSelection(-1)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        moveSelection(1)
      }
    },
    [moveSelection],
  )

  const handleContainerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        moveSelection(-1)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        moveSelection(1)
      }
    },
    [moveSelection],
  )

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      if (userScrollTimeoutRef.current !== null) {
        window.clearTimeout(userScrollTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!normalizedSelectedValue) return

    if (normalizedSelectedValue !== selectedValue) {
      onSelect(normalizedSelectedValue)
      return
    }

    const shouldAnimate = hasInitializedRef.current
      ? !isUserScrollingRef.current
      : false
    scrollToValue(normalizedSelectedValue, shouldAnimate)
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
    }
  }, [
    clearPendingSelection,
    normalizedSelectedValue,
    onSelect,
    scrollToValue,
    selectedValue,
  ])
  const activeValue = interimSelection ?? normalizedSelectedValue

  return {
    containerRef,
    handleScroll,
    handleButtonKeyDown,
    handleContainerKeyDown,
    clearPendingSelection,
    activeValue,
  }
}
