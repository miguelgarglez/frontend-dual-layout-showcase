// Pull UI-related defaults from the shared data module so this reducer stays portable.
import { defaultTimeRangeId } from './timeRangeData'

export type FrequencyValue = 'single' | 'weekly'
export type WeekdayValue =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun'
export type TimeSelectionMode = 'range' | 'exact'

export type DurationSliderConfig = {
  min: number
  max: number
  step: number
  defaultValue: number
}

export const durationSliderConfig: DurationSliderConfig = {
  min: 30,
  max: 240,
  step: 15,
  defaultValue: 150,
} as const

const buildDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const getDefaultSingleDateKey = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return buildDateKey(today)
}

export type ResponsiveRequestFormValues = {
  frequencyMode: FrequencyValue
  singleDateKey: string
  weeklyDays: WeekdayValue[]
  durationMinutes: number
  timeSelectionMode: TimeSelectionMode
  timeRangeId: string
  exactStartTime: {
    hour: string
    minute: string
  }
}

export const buildInitialState = (): ResponsiveRequestFormValues => ({
  frequencyMode: 'single',
  singleDateKey: getDefaultSingleDateKey(),
  weeklyDays: ['wed'],
  durationMinutes: durationSliderConfig.defaultValue,
  timeSelectionMode: 'range',
  timeRangeId: defaultTimeRangeId,
  exactStartTime: {
    hour: '21',
    minute: '30',
  },
})

const cloneFormValues = (
  values: ResponsiveRequestFormValues,
): ResponsiveRequestFormValues => ({
  ...values,
  weeklyDays: [...values.weeklyDays],
  exactStartTime: { ...values.exactStartTime },
})

export type ResponsiveRequestFormAction =
  | { type: 'setFrequencyMode'; value: FrequencyValue }
  | { type: 'setSingleDateKey'; value: string }
  | { type: 'setWeeklyDays'; value: WeekdayValue[] }
  | { type: 'setDurationMinutes'; value: number }
  | { type: 'setTimeSelectionMode'; value: TimeSelectionMode }
  | { type: 'setTimeRangeId'; value: string }
  | { type: 'setExactHour'; value: string }
  | { type: 'setExactMinute'; value: string }
  | { type: 'reset'; value?: ResponsiveRequestFormValues }

export const responsiveRequestFormReducer = (
  state: ResponsiveRequestFormValues,
  action: ResponsiveRequestFormAction,
): ResponsiveRequestFormValues => {
  switch (action.type) {
    case 'setFrequencyMode':
      return { ...state, frequencyMode: action.value }
    case 'setSingleDateKey':
      return { ...state, singleDateKey: action.value }
    case 'setWeeklyDays':
      return { ...state, weeklyDays: action.value }
    case 'setDurationMinutes':
      return { ...state, durationMinutes: action.value }
    case 'setTimeSelectionMode':
      return { ...state, timeSelectionMode: action.value }
    case 'setTimeRangeId':
      return { ...state, timeRangeId: action.value }
    case 'setExactHour':
      return {
        ...state,
        exactStartTime: { ...state.exactStartTime, hour: action.value },
      }
    case 'setExactMinute':
      return {
        ...state,
        exactStartTime: { ...state.exactStartTime, minute: action.value },
      }
    case 'reset':
      return cloneFormValues(action.value ?? buildInitialState())
    default:
      return state
  }
}
