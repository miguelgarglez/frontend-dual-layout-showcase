import { useFocusTrap, type UseFocusTrapOptions } from '@lib/a11y/useFocusTrap'
import type { ReactNode } from 'react'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@lib/utils/cn'
import { useBodyScrollLock } from '@lib/dom/useBodyScrollLock'

type PopoverProps = {
  open: boolean
  onClose?: () => void
  children: ReactNode
  labelledBy?: string
  label?: string
  className?: string
  overlayClassName?: string
  returnFocus?: () => HTMLElement | null | undefined
}

/**
 * Minimal popover rendered via portal. Future enhancement: focus trap, better animations, etc.
 * Maybe use an existing Popover component from a UI components library.
 */
const Popover = ({
  open,
  onClose,
  children,
  labelledBy,
  label,
  className,
  overlayClassName,
  returnFocus,
}: PopoverProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const isBrowser = typeof document !== 'undefined'

  useBodyScrollLock(open && isBrowser)

  const focusTrapOptions = useMemo<UseFocusTrapOptions<HTMLDivElement>>(
    () =>
      returnFocus
        ? {
            containerRef: dialogRef,
            active: open && isBrowser,
            onEscape: onClose,
            returnFocus,
          }
        : {
            containerRef: dialogRef,
            active: open && isBrowser,
            onEscape: onClose,
          },
    [isBrowser, onClose, open, returnFocus],
  )

  useFocusTrap(focusTrapOptions)

  if (!isBrowser || !open) {
    return null
  }

  if (!labelledBy && !label) {
    throw new Error(
      'Popover requires either `labelledBy` or `label` to provide an accessible name.',
    )
  }

  return createPortal(
    <div
      className={cn(
        'bg-overlay-90/60 fixed inset-0 z-70 flex items-center justify-center px-4 py-8',
        overlayClassName,
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        ref={dialogRef}
        className={cn(
          'w-full max-w-4xl rounded-xl bg-white shadow-2xl',
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Popover
