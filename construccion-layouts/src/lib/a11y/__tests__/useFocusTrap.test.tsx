import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import useFocusTrap from '../useFocusTrap'

const FocusTrapHarness = ({
  active = true,
  onEscape,
}: {
  active?: boolean
  onEscape?: () => void
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useFocusTrap({
    containerRef,
    active,
    onEscape,
  })

  return (
    <div>
      <button type="button">Botón externo</button>
      <div ref={containerRef}>
        <button type="button">Elemento 1</button>
        <button type="button">Elemento 2</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('moves focus inside the container and cycles with Tab', async () => {
    render(<FocusTrapHarness />)
    const user = userEvent.setup()

    const first = await screen.findByRole('button', { name: 'Elemento 1' })
    const second = screen.getByRole('button', { name: 'Elemento 2' })

    await waitFor(() => expect(first).toHaveFocus())

    await user.tab()
    expect(second).toHaveFocus()

    await user.tab()
    expect(first).toHaveFocus()

    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(second).toHaveFocus()
  })

  it('invokes onEscape when Escape is pressed', async () => {
    const onEscape = vi.fn()
    render(<FocusTrapHarness onEscape={onEscape} />)
    const user = userEvent.setup()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Elemento 1' })).toHaveFocus(),
    )

    await user.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the previously active element on cleanup', async () => {
    const externalTrigger = document.createElement('button')
    externalTrigger.textContent = 'Externo'
    document.body.appendChild(externalTrigger)
    externalTrigger.focus()

    const { unmount } = render(<FocusTrapHarness />)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Elemento 1' })).toHaveFocus(),
    )

    unmount()
    await waitFor(() => expect(externalTrigger).toHaveFocus())

    externalTrigger.remove()
  })
})
