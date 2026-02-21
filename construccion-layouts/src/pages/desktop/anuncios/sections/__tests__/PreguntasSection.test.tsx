import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import PreguntasSection from '../PreguntasSection'

describe('PreguntasSection FAQ reveal', () => {
  it('expands and collapses the extra FAQs while keeping aria wiring intact', async () => {
    const user = userEvent.setup()
    render(<PreguntasSection />)

    const toggle = screen.getByRole('button', { name: /ver todo/i })
    expect(toggle).toHaveAttribute('aria-controls', 'preguntas-extra-content')

    const extraContent = document.getElementById(
      'preguntas-extra-content',
    ) as HTMLDivElement | null

    if (!extraContent) {
      throw new Error('Expected preguntas extra content container to exist')
    }

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(extraContent).toHaveAttribute('aria-hidden', 'true')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveTextContent('Dejar de ver todo')
    expect(extraContent).toHaveAttribute('aria-hidden', 'false')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveTextContent('Ver todo')
    expect(extraContent).toHaveAttribute('aria-hidden', 'true')
  })
})
