import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ResponsiveRequestForm from '../ResponsiveRequestForm'
import {
  ResponsiveRequestFormProvider,
  useResponsiveRequestForm,
} from '../ResponsiveRequestFormContext'
import {
  buildInitialState,
  type ResponsiveRequestFormValues,
} from '../responsiveRequestFormState'

const FormDebugger = () => {
  const { state, actions, resetForm, isSubmitting } = useResponsiveRequestForm()

  return (
    <div>
      <pre data-testid="form-state">{JSON.stringify(state)}</pre>
      <span data-testid="is-submitting">{isSubmitting ? 'true' : 'false'}</span>
      <button
        type="button"
        onClick={() => actions.setDurationMinutes(45)}
      >
        Set duration
      </button>
      <button
        type="button"
        onClick={() => actions.setFrequencyMode('weekly')}
      >
        Switch to weekly
      </button>
      <button type="button" onClick={resetForm}>
        Reset form
      </button>
    </div>
  )
}

type RenderFormOptions = {
  onSubmit?: (values: ResponsiveRequestFormValues) => void | Promise<void>
  initialState?: ResponsiveRequestFormValues
}

const renderForm = ({
  onSubmit = vi.fn<(values: ResponsiveRequestFormValues) => void>(),
  initialState,
}: RenderFormOptions = {}) =>
  render(
    <ResponsiveRequestFormProvider {...(initialState ? { initialState } : {})}>
      <ResponsiveRequestForm onSubmit={onSubmit}>
        <FormDebugger />
        <button type="submit">Submit</button>
      </ResponsiveRequestForm>
    </ResponsiveRequestFormProvider>,
  )

describe('ResponsiveRequestFormProvider + ResponsiveRequestForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('submits the latest context state when the form is submitted', async () => {
    const handleSubmit = vi.fn<(values: ResponsiveRequestFormValues) => void>()
    renderForm({ onSubmit: handleSubmit })

    fireEvent.click(screen.getByText('Set duration'))
    fireEvent.click(screen.getByText('Switch to weekly'))
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    const submittedState = handleSubmit.mock.calls[0][0]
    expect(submittedState.durationMinutes).toBe(45)
    expect(submittedState.frequencyMode).toBe('weekly')
  })

  it('resets the state back to the defaults', () => {
    renderForm()

    fireEvent.click(screen.getByText('Set duration'))
    fireEvent.click(screen.getByText('Switch to weekly'))

    const alteredState = JSON.parse(
      screen.getByTestId('form-state').textContent ?? '{}',
    )
    expect(alteredState.frequencyMode).toBe('weekly')

    fireEvent.click(screen.getByText('Reset form'))

    const restored = JSON.parse(
      screen.getByTestId('form-state').textContent ?? '{}',
    )
    expect(restored).toEqual(buildInitialState())
  })

  it('resets back to the provider initialState when available', () => {
    const hydratedState: ResponsiveRequestFormValues = {
      frequencyMode: 'weekly',
      singleDateKey: '2025-02-10',
      weeklyDays: ['mon', 'fri'],
      durationMinutes: 90,
      timeSelectionMode: 'exact',
      timeRangeId: 'range-custom',
      exactStartTime: { hour: '08', minute: '45' },
    }

    renderForm({ initialState: hydratedState })

    const hydrated = JSON.parse(
      screen.getByTestId('form-state').textContent ?? '{}',
    )
    expect(hydrated).toEqual(hydratedState)

    fireEvent.click(screen.getByText('Set duration'))
    fireEvent.click(screen.getByText('Switch to weekly'))
    fireEvent.click(screen.getByText('Reset form'))

    const restored = JSON.parse(
      screen.getByTestId('form-state').textContent ?? '{}',
    )
    expect(restored).toEqual(hydratedState)
  })

  it('exposes submission state while awaiting async submit handlers', async () => {
    let resolveSubmit: (() => void) | undefined
    const handleSubmit = vi
      .fn<(values: ResponsiveRequestFormValues) => Promise<void>>()
      .mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve
          }),
      )

    renderForm({ onSubmit: handleSubmit })

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('is-submitting').textContent).toBe('true')

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveSubmit?.()
    })

    expect(screen.getByTestId('is-submitting').textContent).toBe('false')
  })
})
