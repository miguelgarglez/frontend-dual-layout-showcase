import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { formatMonthKey } from '../calendarUtils'
import type { MonthAnchor } from './useCalendarRange'

type UseMonthScrollerParams = {
  selectedDate: Date
  normalizedSelectedDateKey: string
  monthAnchors: MonthAnchor[]
  scrollerRef?: RefObject<HTMLDivElement | null>
}

type UseMonthScrollerResult = {
  visibleMonthKey: string
  setVisibleMonthKey: Dispatch<SetStateAction<string>>
  scrollerRef: RefObject<HTMLDivElement | null>
  registerDayRef: (key: string, node: HTMLButtonElement | null) => void
}

const useMonthScroller = ({
  selectedDate,
  normalizedSelectedDateKey,
  monthAnchors,
  scrollerRef: externalScrollerRef,
}: UseMonthScrollerParams): UseMonthScrollerResult => {
  const [visibleMonthKey, setVisibleMonthKey] = useState(() =>
    formatMonthKey(selectedDate),
  )

  const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const fallbackScrollerRef = useRef<HTMLDivElement | null>(null)
  const scrollerRef = externalScrollerRef ?? fallbackScrollerRef
  const monthOffsetsRef = useRef<Array<{ start: number; monthKey: string }>>([])
  const measurementRafRef = useRef<number | null>(null)
  const scrollRafRef = useRef<number | null>(null)

  const registerDayRef = useCallback(
    (key: string, node: HTMLButtonElement | null) => {
      if (node) {
        dayRefs.current[key] = node
      } else {
        delete dayRefs.current[key]
      }
    },
    [],
  )

  useEffect(() => {
    const node = dayRefs.current[normalizedSelectedDateKey]
    node?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }, [normalizedSelectedDateKey])

  const updateVisibleMonthFromScroll = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    const container = scrollerRef.current
    if (!container) {
      return
    }

    const offsets = monthOffsetsRef.current
    if (!offsets.length) {
      return
    }

    const centerPosition = container.scrollLeft + container.clientWidth / 2
    let activeMonthKey = offsets[0]?.monthKey
    if (!activeMonthKey) {
      return
    }

    for (let index = 0; index < offsets.length; index++) {
      if (centerPosition >= offsets[index].start) {
        activeMonthKey = offsets[index].monthKey
      } else {
        break
      }
    }

    setVisibleMonthKey((prev) =>
      prev === activeMonthKey ? prev : activeMonthKey,
    )
  }, [scrollerRef])

  const scheduleMonthOffsetComputation = useCallback(() => {
    if (measurementRafRef.current !== null) {
      cancelAnimationFrame(measurementRafRef.current)
    }

    measurementRafRef.current = window.requestAnimationFrame(() => {
      measurementRafRef.current = null
      const offsets: Array<{ start: number; monthKey: string }> = []
      monthAnchors.forEach(({ dayKey, monthKey }) => {
        const node = dayRefs.current[dayKey]
        if (!node) {
          return
        }
        offsets.push({ start: node.offsetLeft, monthKey })
      })
      monthOffsetsRef.current = offsets
      updateVisibleMonthFromScroll()
    })
  }, [monthAnchors, updateVisibleMonthFromScroll])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const cleanupRaf = () => {
      if (measurementRafRef.current !== null) {
        cancelAnimationFrame(measurementRafRef.current)
        measurementRafRef.current = null
      }
    }

    scheduleMonthOffsetComputation()

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() =>
        scheduleMonthOffsetComputation(),
      )

      if (scrollerRef.current) {
        resizeObserver.observe(scrollerRef.current)
      }

      return () => {
        cleanupRaf()
        resizeObserver.disconnect()
      }
    }

    window.addEventListener('resize', scheduleMonthOffsetComputation)
    return () => {
      cleanupRaf()
      window.removeEventListener('resize', scheduleMonthOffsetComputation)
    }
  }, [scheduleMonthOffsetComputation, scrollerRef])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const container = scrollerRef.current
    if (!container) {
      return
    }

    const handleScroll = () => {
      if (scrollRafRef.current !== null) {
        return
      }
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null
        updateVisibleMonthFromScroll()
      })
    }

    updateVisibleMonthFromScroll()
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [scrollerRef, updateVisibleMonthFromScroll])

  return { visibleMonthKey, setVisibleMonthKey, scrollerRef, registerDayRef }
}

export default useMonthScroller
