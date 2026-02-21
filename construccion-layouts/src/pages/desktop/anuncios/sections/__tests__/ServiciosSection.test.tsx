import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ServiciosSection from '../ServiciosSection'

describe('ServiciosSection accordion', () => {
  it('collapses and re-expands service rows updating aria + inert props', async () => {
    const user = userEvent.setup()
    render(<ServiciosSection />)

    const montageToggle = screen.getByRole('button', { name: /montaje/i })
    const montagePanel = document.getElementById(
      'service-row-montaje',
    ) as HTMLDivElement | null

    if (!montagePanel) {
      throw new Error('Expected montage accordion panel to be rendered')
    }

    expect(montageToggle).toHaveAttribute('aria-expanded', 'true')
    expect(montagePanel).toHaveAttribute('aria-hidden', 'false')
    expect(montagePanel.querySelector('[inert]')).toBeNull()

    await user.click(montageToggle)

    expect(montageToggle).toHaveAttribute('aria-expanded', 'false')
    expect(montagePanel).toHaveAttribute('aria-hidden', 'true')
    expect(montagePanel.querySelector('[inert]')).not.toBeNull()

    await user.click(montageToggle)

    expect(montageToggle).toHaveAttribute('aria-expanded', 'true')
    expect(montagePanel).toHaveAttribute('aria-hidden', 'false')
    expect(montagePanel.querySelector('[inert]')).toBeNull()
  })

  it('links toggle buttons with their controlled regions for placeholder rows', async () => {
    const user = userEvent.setup()
    render(<ServiciosSection />)

    const colgadoToggle = screen.getByRole('button', { name: /colgado/i })
    const controlledId = colgadoToggle.getAttribute('aria-controls')
    expect(controlledId).toBe('service-row-colgado')

    const colgadoPanel = document.getElementById(
      controlledId ?? '',
    ) as HTMLDivElement | null

    if (!colgadoPanel) {
      throw new Error('Expected colgado accordion panel to be rendered')
    }

    expect(colgadoToggle).toHaveAttribute('aria-expanded', 'false')
    expect(colgadoPanel).toHaveAttribute('aria-hidden', 'true')

    await user.click(colgadoToggle)

    expect(colgadoToggle).toHaveAttribute('aria-expanded', 'true')
    expect(colgadoPanel).toHaveAttribute('aria-hidden', 'false')
    expect(colgadoPanel.querySelector('[inert]')).toBeNull()
  })
})
