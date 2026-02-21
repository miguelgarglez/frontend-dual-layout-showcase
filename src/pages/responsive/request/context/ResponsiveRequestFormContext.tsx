/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  buildInitialState,
  responsiveRequestFormReducer,
  type FrequencyValue,
  type ResponsiveRequestFormValues,
  type TimeSelectionMode,
  type WeekdayValue,
} from './responsiveRequestFormState'

type ResponsiveRequestFormContextValue = {
  state: ResponsiveRequestFormValues
  isSubmitting: boolean
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  actions: {
    setFrequencyMode: (mode: FrequencyValue) => void
    setSingleDateKey: (dateKey: string) => void
    setWeeklyDays: (days: WeekdayValue[]) => void
    setDurationMinutes: (minutes: number) => void
    setTimeSelectionMode: (mode: TimeSelectionMode) => void
    setTimeRangeId: (rangeId: string) => void
    setExactHour: (hour: string) => void
    setExactMinute: (minute: string) => void
  }
  resetForm: () => void
}

const ResponsiveRequestFormContext = createContext<
  ResponsiveRequestFormContextValue | undefined
>(undefined)

type ResponsiveRequestFormProviderProps = {
  children: ReactNode
  /**
   * Allows hydration with server data or stored filters.
   */
  initialState?: ResponsiveRequestFormValues | undefined
  /**
   * Useful for persisting the latest selections somewhere else (URL, storage, analytics, etc.).
   */
  onChange?: ((values: ResponsiveRequestFormValues) => void | Promise<void>) | undefined
}

export const ResponsiveRequestFormProvider = ({
  children,
  initialState,
  onChange,
}: ResponsiveRequestFormProviderProps) => {
  const initialStateForReducer = useMemo(
    () => initialState ?? buildInitialState(),
    [initialState],
  )
  const initialFormStateRef = useRef<ResponsiveRequestFormValues>(initialStateForReducer)

  const [state, dispatch] = useReducer(
    responsiveRequestFormReducer,
    initialStateForReducer,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialStateForReducer === initialFormStateRef.current) {
      return
    }

    initialFormStateRef.current = initialStateForReducer
    dispatch({ type: 'reset', value: initialStateForReducer })
  }, [initialStateForReducer])

  useEffect(() => {
    if (onChange) {
      onChange(state)
    }
  }, [onChange, state])

  const resetForm = useCallback(() => {
    dispatch({ type: 'reset', value: initialFormStateRef.current })
  }, [])

  const actions = useMemo<ResponsiveRequestFormContextValue['actions']>(
    () => ({
      setFrequencyMode: (mode) =>
        dispatch({ type: 'setFrequencyMode', value: mode }),
      setSingleDateKey: (dateKey) =>
        dispatch({ type: 'setSingleDateKey', value: dateKey }),
      setWeeklyDays: (days) => dispatch({ type: 'setWeeklyDays', value: days }),
      setDurationMinutes: (minutes) =>
        dispatch({ type: 'setDurationMinutes', value: minutes }),
      setTimeSelectionMode: (mode) =>
        dispatch({ type: 'setTimeSelectionMode', value: mode }),
      setTimeRangeId: (rangeId) =>
        dispatch({ type: 'setTimeRangeId', value: rangeId }),
      setExactHour: (hour) => dispatch({ type: 'setExactHour', value: hour }),
      setExactMinute: (minute) =>
        dispatch({ type: 'setExactMinute', value: minute }),
    }),
    [dispatch],
  )

  const contextValue = useMemo<ResponsiveRequestFormContextValue>(
    () => ({
      state,
      isSubmitting,
      setIsSubmitting,
      actions,
      resetForm,
    }),
    [actions, isSubmitting, resetForm, setIsSubmitting, state],
  )
  /**
   * NOTE: Because we expose the entire reducer state from a single context, every consumer
   * re-renders when any field changes. If the number of sections or heavy widgets grows, we should
   * split the provider into selectors/dispatchers or lean on a form library (React Hook Form,
   * TanStack Form, Final Form) so each control subscribes only to the slice it needs.
   */

  return (
    <ResponsiveRequestFormContext.Provider value={contextValue}>
      {children}
    </ResponsiveRequestFormContext.Provider>
  )
}

export const useResponsiveRequestForm = () => {
  const context = useContext(ResponsiveRequestFormContext)
  if (!context) {
    throw new Error(
      'useResponsiveRequestForm must be used within ResponsiveRequestFormProvider',
    )
  }
  return context
}

export type {
  FrequencyValue,
  WeekdayValue,
  TimeSelectionMode,
  ResponsiveRequestFormValues,
} from './responsiveRequestFormState'
