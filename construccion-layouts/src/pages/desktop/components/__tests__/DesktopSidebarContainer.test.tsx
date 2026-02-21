import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DesktopSidebarContainer from '../DesktopSidebarContainer'

const renderSidebar = () =>
  render(
    <DesktopSidebarContainer>
      <nav aria-label="Sidebar quick actions" className="flex flex-col gap-2">
        <a href="#primer-enlace">Primer enlace</a>
        <button type="button">Acción lateral</button>
      </nav>
    </DesktopSidebarContainer>,
  )

const overrideMatchMedia = (initialMatches: boolean) => {
  const originalMatchMedia = window.matchMedia
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  let currentMatches = initialMatches

  const mockMediaQuery = {
    get matches() {
      return currentMatches
    },
    media: '(min-width: 1024px)',
    onchange: null,
    addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList

  window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery) as typeof window.matchMedia

  const setMatches = (value: boolean) => {
    currentMatches = value
    const event = { matches: value, media: mockMediaQuery.media } as MediaQueryListEvent
    mockMediaQuery.onchange?.(event)
    listeners.forEach((listener) => listener(event))
  }

  const restore = () => {
    window.matchMedia = originalMatchMedia
    listeners.clear()
  }

  return { setMatches, restore }
}

describe('DesktopSidebarContainer', () => {
  it('opens the drawer via the toggle button and closes via the overlay', async () => {
    const user = userEvent.setup()
    renderSidebar()

    const toggle = screen.getByRole('button', { name: /abrir menú lateral/i })
    const sidebar = screen.getByRole('complementary', { hidden: true })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', sidebar.id)
    expect(sidebar).toHaveAttribute('aria-hidden', 'true')
    expect(sidebar).toHaveAttribute('inert')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(sidebar).toHaveAttribute('aria-hidden', 'false')
    expect(sidebar).not.toHaveAttribute('inert')

    const overlay = screen.getByRole('presentation', { hidden: true })
    await user.click(overlay)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(sidebar).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('presentation', { hidden: true })).not.toBeInTheDocument()
  })

  it('returns focus to the toggle button when closed with Escape', async () => {
    const user = userEvent.setup()
    renderSidebar()

    const toggle = screen.getByRole('button', { name: /abrir menú lateral/i })

    await user.click(toggle)

    const firstNavLink = screen.getByRole('link', { name: /primer enlace/i })
    await waitFor(() => expect(firstNavLink).toHaveFocus())

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('presentation', { hidden: true })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('keeps the sidebar interactive when rendered at the desktop breakpoint', () => {
    const { restore } = overrideMatchMedia(true)

    try {
      renderSidebar()

      const sidebar = screen.getByRole('complementary', { hidden: true })

      expect(sidebar).toHaveAttribute('aria-hidden', 'false')
      expect(sidebar).not.toHaveAttribute('inert')
      expect(sidebar).not.toHaveAttribute('tabindex')
    } finally {
      restore()
    }
  })

  it('closes the sidebar when the viewport shrinks below the desktop breakpoint', async () => {
    const user = userEvent.setup()
    const controls = overrideMatchMedia(true)

    try {
      renderSidebar()
      const toggle = screen.getByRole('button', { name: /abrir menú lateral/i })
      const sidebar = screen.getByRole('complementary', { hidden: true })

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(sidebar).toHaveAttribute('aria-hidden', 'false')

      act(() => {
        controls.setMatches(false)
      })

      await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'))
      expect(sidebar).toHaveAttribute('aria-hidden', 'true')
      expect(sidebar).toHaveAttribute('inert')
    } finally {
      controls.restore()
    }
  })
})
