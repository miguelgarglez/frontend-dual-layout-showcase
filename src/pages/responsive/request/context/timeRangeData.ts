// This module purposely lives next to the reducer so both the state layer
// and the UI reference the same pure data without React/Lucide coupling.
export type TimeRangeIconId = 'sunrise' | 'sun' | 'sunset' | 'moonStar'

export type TimeRangeOption = {
  id: string
  label: string
  icon: TimeRangeIconId
}

export type TimeRangeGroup = {
  label: string
  ranges: TimeRangeOption[]
}

export const timeRangeGroups: TimeRangeGroup[] = [
  {
    label: 'Mañana',
    ranges: [
      { id: 'range-06-09', label: '6 - 9', icon: 'sunrise' },
      { id: 'range-09-12', label: '9 - 12', icon: 'sun' },
      { id: 'range-12-15', label: '12 - 15', icon: 'sun' },
    ],
  },
  {
    label: 'Tarde',
    ranges: [
      { id: 'range-15-18', label: '15 - 18', icon: 'sun' },
      { id: 'range-18-21', label: '18 - 21', icon: 'sunset' },
      { id: 'range-21-00', label: '21 - 00', icon: 'moonStar' },
    ],
  },
]

export const timeRangeOptions = timeRangeGroups.flatMap((group) => group.ranges)

export const defaultTimeRangeId =
  timeRangeOptions[1]?.id ?? timeRangeOptions[0]?.id ?? 'range-06-09'
