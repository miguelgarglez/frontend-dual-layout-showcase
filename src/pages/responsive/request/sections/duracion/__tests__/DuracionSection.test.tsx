import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DuracionSection from '../DuracionSection'
import {
  ResponsiveRequestFormProvider,
  useResponsiveRequestForm,
} from '../../../context/ResponsiveRequestFormContext'
import { buildInitialState } from '../../../context/responsiveRequestFormState'

const DurationProbe = () => {
  const {
    state: { durationMinutes },
  } = useResponsiveRequestForm()

  return <span data-testid="duration-minutes">{durationMinutes}</span>
}

const renderDuracionSection = () => {
  const initialState = {
    ...buildInitialState(),
    durationMinutes: 75,
  }

  return render(
    <ResponsiveRequestFormProvider initialState={initialState}>
      <DuracionSection />
      <DurationProbe />
    </ResponsiveRequestFormProvider>,
  )
}

describe('DuracionSection', () => {
  it('updates context state and header when moving the slider', () => {
    renderDuracionSection()

    const slider = screen.getByRole('slider', {
      name: /select how long the service will take/i,
    })
    expect(screen.getByText('1h 15min')).toBeInTheDocument()
    expect(screen.getByTestId('duration-minutes')).toHaveTextContent('75')

    fireEvent.change(slider, { target: { value: '105' } })

    expect(screen.getByText('1h 45min')).toBeInTheDocument()
    expect(screen.getByTestId('duration-minutes')).toHaveTextContent('105')
  })
})
