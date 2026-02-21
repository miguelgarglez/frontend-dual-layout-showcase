import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Menu, X } from 'lucide-react'
import useFocusTrap from '@lib/a11y/useFocusTrap'
import { cn } from '@lib/utils/cn'

type DesktopSidebarContainerProps = {
  children: ReactNode
}

/** Handles the responsive/collapsible behavior of the desktop sidebar */
const DesktopSidebarContainer = ({
  children,
}: DesktopSidebarContainerProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktopBreakpoint, setIsDesktopBreakpoint] = useState(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return false
    }
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const sidebarId = useId()
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const collapsedButtonLeft = '1rem'
  // Expose sidebar width as a single custom property so every dependent element (button offset, placeholder,
  // actual aside) stays perfectly in sync when design tweaks the measurement.
  const sidebarWidth = '18rem'
  const sidebarCustomProperties = {
    '--sidebar-width': sidebarWidth,
  } as CSSProperties
  const buttonGapFromEdge = '-0.75rem'
  const buttonLeft = isSidebarOpen
    ? `calc(var(--sidebar-width) - ${buttonGapFromEdge})`
    : collapsedButtonLeft
  const isSidebarInteractive = isSidebarOpen || isDesktopBreakpoint

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopBreakpoint(event.matches)
      if (!event.matches) {
        closeSidebar()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [closeSidebar])

  useFocusTrap({
    containerRef: sidebarRef,
    active: isSidebarOpen && !isDesktopBreakpoint,
    onEscape: closeSidebar,
    returnFocus: () => toggleButtonRef.current,
  })

  return (
    // we pass the custom property down without introducing an extra layout wrapper.
    <div className="contents" style={sidebarCustomProperties}>
      <button
        type="button"
        onClick={toggleSidebar}
        aria-controls={sidebarId}
        aria-expanded={isSidebarOpen}
        aria-label={
          isSidebarOpen ? 'Close sidebar menu' : 'Open sidebar menu'
        }
        className={cn(
          'pressable focus-outline-brand absolute top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow transition-all duration-300 ease-out lg:hidden',
          isSidebarOpen && 'shadow-lg',
        )}
        style={{ left: buttonLeft }}
        ref={toggleButtonRef}
      >
        {isSidebarOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </button>

      {isSidebarOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-overlay-90/60 transition-opacity lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="relative h-full w-0 shrink-0 lg:w-(--sidebar-width)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden bg-white lg:block"
        />

        <aside
          id={sidebarId}
          ref={sidebarRef}
          className={cn(
            'fixed inset-y-0 left-0 z-40 h-full w-(--sidebar-width) overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none lg:relative lg:z-10 lg:translate-x-0',
            isSidebarOpen
              ? 'translate-x-0 shadow-2xl lg:shadow-none'
              : '-translate-x-full lg:translate-x-0',
          )}
          aria-hidden={!isSidebarInteractive}
          inert={!isSidebarInteractive}
          tabIndex={isDesktopBreakpoint ? undefined : -1}
        >
          {children}
        </aside>
      </div>
    </div>
  )
}

export default DesktopSidebarContainer
