import { type RefObject, useEffect } from 'react'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((element) => {
    if (element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true' || element.tabIndex === -1) {
      return false
    }

    const style = window.getComputedStyle(element)
    const isHidden = (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      element.hasAttribute('hidden') ||
      (element instanceof HTMLInputElement && element.type === 'hidden')
    )

    return !isHidden
  })

export type UseFocusTrapOptions<T extends HTMLElement> = {
  containerRef: RefObject<T | null>
  active: boolean
  onEscape?: (() => void) | undefined
  returnFocus?: () => HTMLElement | null | undefined
}

/**
 * Lightweight focus trap hook used by both the desktop sidebar and gallery dialog.
 * Ensures focus stays inside the provided container while `active` is true and restores focus afterward.
 */
export const useFocusTrap = <T extends HTMLElement>({
  containerRef,
  active,
  onEscape,
  returnFocus,
}: UseFocusTrapOptions<T>) => {
  useEffect(() => {
    if (!active || typeof document === 'undefined') {
      return undefined
    }

    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    const focusable = getFocusableElements(container)
    const elementToFocus = focusable[0] ?? container
    const focusFrame = window.requestAnimationFrame(() => {
      elementToFocus.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscape?.()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const currentFocusable = getFocusableElements(container)
      if (currentFocusable.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const firstElement = currentFocusable[0]
      const lastElement = currentFocusable[currentFocusable.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault()
          lastElement.focus()
        }
        return
      }

      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.cancelAnimationFrame(focusFrame)

      const focusTarget = returnFocus?.() ?? previouslyFocusedElement
      focusTarget?.focus()
    }
  }, [active, containerRef, onEscape, returnFocus])
}

export default useFocusTrap
