import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import GaleriaSection from '../GaleriaSection'

describe('GaleriaSection dialog', () => {
  it('opens via the link button and closes with the dialog action', async () => {
    const user = userEvent.setup()
    render(<GaleriaSection />)

    const trigger = screen.getByRole('button', { name: /ver galería/i })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(trigger)

    const dialog = await screen.findByRole('dialog', {
      name: 'Galería completa',
    })
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const closeButton = within(dialog).getByRole('button', { name: /cerrar/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when pressing Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<GaleriaSection />)

    const trigger = screen.getByRole('button', { name: /ver galería/i })
    trigger.focus()

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
