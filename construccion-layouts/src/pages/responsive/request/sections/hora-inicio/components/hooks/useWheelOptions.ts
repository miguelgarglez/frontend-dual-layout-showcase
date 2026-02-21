import { useCallback, useMemo } from 'react'

/**
 * Returns the selectable wheel entries, excluding the blank placeholders used to pad the scroll area.
 */
export const useSelectableValues = (values: string[]) => {
  return useMemo(() => values.filter((value) => Boolean(value)), [values])
}

/**
 * Ensures any upstream value resolves to a valid wheel option by snapping to the nearest candidate.
 */
export const useValueNormalizer = (selectableValues: string[]) => {
  return useCallback(
    (value: string | null | undefined) => {
      if (!selectableValues.length) return undefined
      if (value && selectableValues.includes(value)) {
        return value
      }

      const numericValue =
        value !== null && value !== undefined ? Number(value) : NaN
      const numericCandidates = selectableValues
        .map((candidate) => ({ candidate, numeric: Number(candidate) }))
        .filter(({ numeric }) => !Number.isNaN(numeric))

      if (!Number.isNaN(numericValue) && numericCandidates.length) {
        let closest = numericCandidates[0]
        let smallestDelta = Math.abs(closest.numeric - numericValue)
        for (let index = 1; index < numericCandidates.length; index += 1) {
          const candidate = numericCandidates[index]
          const delta = Math.abs(candidate.numeric - numericValue)
          if (delta < smallestDelta) {
            smallestDelta = delta
            closest = candidate
          }
        }
        return closest.candidate
      }

      return selectableValues[0]
    },
    [selectableValues],
  )
}
