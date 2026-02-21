import { useCallback, useEffect, useRef, useState } from 'react'

const gradientVisibilityThreshold = 0.0
export const RESPONSIVE_BODY_GRADIENT_CLASS = 'responsive-layout-body--gradient'
export const RESPONSIVE_BODY_DEFAULT_CLASS = 'responsive-layout-body--default'

const useResponsiveBodyBackground = () => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headerElementRef = useRef<HTMLDivElement | null>(null)
  const [isGradientActive, setIsGradientActive] = useState(true)

  useEffect(() => {
    const { classList } = document.body

    if (isGradientActive) {
      classList.add(RESPONSIVE_BODY_GRADIENT_CLASS)
      classList.remove(RESPONSIVE_BODY_DEFAULT_CLASS)
    } else {
      classList.add(RESPONSIVE_BODY_DEFAULT_CLASS)
      classList.remove(RESPONSIVE_BODY_GRADIENT_CLASS)
    }
  }, [isGradientActive])

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      document.body.classList.remove(
        RESPONSIVE_BODY_GRADIENT_CLASS,
        RESPONSIVE_BODY_DEFAULT_CLASS,
      )
    }
  }, [])

  const updateGradientState = useCallback((element: HTMLElement) => {
    const ratio = getVisibilityRatio(element)
    const nextState = ratio > gradientVisibilityThreshold
    setIsGradientActive((prev) => (prev === nextState ? prev : nextState))
  }, [])

  const headerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current && headerElementRef.current) {
        observerRef.current.unobserve(headerElementRef.current)
        observerRef.current.disconnect()
        observerRef.current = null
      }

      headerElementRef.current = node

      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            const ratio =
              entry.intersectionRatio ||
              getVisibilityRatio(entry.target as HTMLElement)
            const nextState =
              entry.isIntersecting && ratio > gradientVisibilityThreshold
            setIsGradientActive((prev) =>
              prev === nextState ? prev : nextState,
            )
          },
          {
            threshold: [0, gradientVisibilityThreshold, 0.5, 1],
          },
        )

        observer.observe(node)
        observerRef.current = observer
        updateGradientState(node)
      }
    },
    [updateGradientState],
  )

  useEffect(() => {
    let ticking = false

    const scheduleUpdate = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (headerElementRef.current) {
          updateGradientState(headerElementRef.current)
        }
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [updateGradientState])

  return headerRef
}

const getVisibilityRatio = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight
  const visibleHeight =
    Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
  if (rect.height === 0) return 0
  return Math.max(0, Math.min(visibleHeight, rect.height)) / rect.height
}

export default useResponsiveBodyBackground
