import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useSelectableValues, useValueNormalizer } from '../useWheelOptions'

describe('useWheelOptions', () => {
  it('filters placeholder values', () => {
    const { result, rerender } = renderHook(
      ({ values }) => useSelectableValues(values),
      {
        initialProps: { values: ['', '01', '', '05'] },
      },
    )

    expect(result.current).toEqual(['01', '05'])

    rerender({ values: ['', '01', '02', ''] })

    expect(result.current).toEqual(['01', '02'])
  })

  it('normalizes invalid selections to the closest candidate', () => {
    const { result } = renderHook(
      ({ values }) => {
        const selectable = useSelectableValues(values)
        return useValueNormalizer(selectable)
      },
      {
        initialProps: { values: ['', '00', '10', '20', ''] },
      },
    )

    expect(result.current('12')).toBe('10')
    expect(result.current('25')).toBe('20')
    expect(result.current(null)).toBe('00')
  })
})

