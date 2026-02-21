import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import {
  buildInitialState,
  responsiveRequestFormReducer,
  type ResponsiveRequestFormValues,
} from '../responsiveRequestFormState'

describe('responsiveRequestFormState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('buildInitialState returns the expected defaults for the current date', () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expectedDateKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')

    const state = buildInitialState()

    expect(state).toMatchObject({
      frequencyMode: 'single',
      singleDateKey: expectedDateKey,
      weeklyDays: ['wed'],
      durationMinutes: 150,
      timeSelectionMode: 'range',
      exactStartTime: { hour: '21', minute: '30' },
    })
    expect(typeof state.timeRangeId).toBe('string')
    expect(state.timeRangeId.length).toBeGreaterThan(0)
  })

  it('handles every reducer action and reset', () => {
    const baseState = buildInitialState()

    const run = (action: Parameters<typeof responsiveRequestFormReducer>[1]) =>
      responsiveRequestFormReducer(baseState, action)

    expect(run({ type: 'setFrequencyMode', value: 'weekly' }).frequencyMode).toBe(
      'weekly',
    )
    expect(run({ type: 'setSingleDateKey', value: '2025-02-10' }).singleDateKey).toBe(
      '2025-02-10',
    )
    expect(run({ type: 'setWeeklyDays', value: ['mon', 'fri'] }).weeklyDays).toEqual([
      'mon',
      'fri',
    ])
    expect(run({ type: 'setDurationMinutes', value: 60 }).durationMinutes).toBe(60)
    expect(
      run({ type: 'setTimeSelectionMode', value: 'exact' }).timeSelectionMode,
    ).toBe('exact')
    expect(run({ type: 'setTimeRangeId', value: 'range-custom' }).timeRangeId).toBe(
      'range-custom',
    )
    expect(run({ type: 'setExactHour', value: '08' }).exactStartTime.hour).toBe('08')
    expect(run({ type: 'setExactMinute', value: '45' }).exactStartTime.minute).toBe(
      '45',
    )

    const mutatedState: ResponsiveRequestFormValues = {
      ...baseState,
      frequencyMode: 'weekly',
      weeklyDays: ['mon', 'fri'],
      durationMinutes: 45,
      timeSelectionMode: 'exact',
      timeRangeId: 'range-custom',
      exactStartTime: { hour: '08', minute: '45' },
    }

    const resetState = responsiveRequestFormReducer(mutatedState, { type: 'reset' })
    expect(resetState).toEqual(buildInitialState())
  })

  it('allows providing a custom payload for reset', () => {
    const mutatedState = buildInitialState()
    const payload: ResponsiveRequestFormValues = {
      ...mutatedState,
      frequencyMode: 'weekly',
      weeklyDays: ['mon'],
      durationMinutes: 30,
      exactStartTime: { hour: '10', minute: '15' },
    }

    const resetState = responsiveRequestFormReducer(mutatedState, {
      type: 'reset',
      value: payload,
    })

    expect(resetState).toEqual(payload)
    expect(resetState).not.toBe(payload)
    expect(resetState.exactStartTime).not.toBe(payload.exactStartTime)
  })
})
