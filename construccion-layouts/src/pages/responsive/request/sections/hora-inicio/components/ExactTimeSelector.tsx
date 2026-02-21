import { useId } from 'react'
import { cn } from '@lib/utils/cn'
import {
  useSelectableValues,
  useValueNormalizer,
} from './hooks/useWheelOptions'
import { useWheelMetrics } from './hooks/useWheelMetrics'
import { useWheelSelection } from './hooks/useWheelSelection'

type ExactTimeSelectorProps = {
  selectedHour: string
  selectedMinute: string
  onSelectHour: (hour: string) => void
  onSelectMinute: (minute: string) => void
}

const hourValues = Array.from({ length: 24 }, (_, index) =>
  index.toString().padStart(2, '0'),
)
const minuteValues = Array.from({ length: 12 }, (_, index) =>
  (index * 5).toString().padStart(2, '0'),
)

const padWheelValues = (values: string[]) => ['', ...values, '']

const wheelHourValues = padWheelValues(hourValues)
const wheelMinuteValues = padWheelValues(minuteValues)

const ExactTimeSelector = ({
  selectedHour,
  selectedMinute,
  onSelectHour,
  onSelectMinute,
}: ExactTimeSelectorProps) => {
  const groupLabelId = useId()
  const instructionsId = useId()

  return (
    <div
      className="relative mx-auto max-w-sm py-1"
      role="group"
      aria-labelledby={groupLabelId}
      aria-describedby={instructionsId}
    >
      {/* Hidden context ensures screen readers announce the purpose of both wheels before users interact */}
      <p id={groupLabelId} className="sr-only">
        Selecciona la hora exacta
      </p>
      <p id={instructionsId} className="sr-only">
        La columna izquierda corresponde a las horas en formato de 24 horas y la
        columna derecha a los minutos en incrementos de cinco.
      </p>
      <div
        className="bg-greyscale-40/60 absolute inset-x-0 top-1/2 z-0 h-10 -translate-y-1/2 rounded-xl"
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-center justify-center">
        <TimePickerColumn
          values={wheelHourValues}
          selectedValue={selectedHour}
          onSelect={onSelectHour}
          ariaLabel="Selector de horas"
          optionLabelPrefix="Hora"
          idPrefix="hour"
        />
        <span className="text-greyscale-140 text-[18px] font-medium">:</span>
        <TimePickerColumn
          values={wheelMinuteValues}
          selectedValue={selectedMinute}
          onSelect={onSelectMinute}
          ariaLabel="Selector de minutos"
          optionLabelPrefix="Minuto"
          idPrefix="minute"
        />
      </div>
    </div>
  )
}

type TimePickerColumnProps = {
  values: string[]
  selectedValue: string
  onSelect: (value: string) => void
  ariaLabel: string
  optionLabelPrefix: string
  idPrefix: string
}

const TimePickerColumn = ({
  values,
  selectedValue,
  onSelect,
  ariaLabel,
  optionLabelPrefix,
  idPrefix,
}: TimePickerColumnProps) => {
  const selectableValues = useSelectableValues(values)
  const normalizeValue = useValueNormalizer(selectableValues)
  const { containerRef, buttonValuesRef, metricsRef, measureButtonMetrics } =
    useWheelMetrics(values)
  const {
    handleScroll,
    handleButtonKeyDown,
    handleContainerKeyDown,
    clearPendingSelection,
    activeValue,
  } = useWheelSelection({
    selectedValue,
    onSelect,
    normalizeValue,
    containerRef,
    buttonValuesRef,
    metricsRef,
    measureButtonMetrics,
  })

  return (
    <div className="relative h-48 w-20">
      <div
        className="pointer-events-none absolute inset-x-1 top-0 h-14 bg-linear-to-b from-white via-white/70 to-white/0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-1 bottom-0 h-14 bg-linear-to-t from-white via-white/70 to-white/0"
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onKeyDown={handleContainerKeyDown}
        className="focus-outline-brand relative z-10 flex h-full snap-y snap-mandatory flex-col items-center overflow-y-auto py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={
          activeValue ? `${idPrefix}-${activeValue}` : undefined
        }
        tabIndex={0}
      >
        {values.map((value, index) => {
          if (!value) {
            return (
              <div
                key={`spacer-${index}`}
                className="h-14 w-full shrink-0"
                aria-hidden="true"
              />
            )
          }

          const optionId = `${idPrefix}-${value}`
          const isActive = value === activeValue

          return (
            <button
              key={optionId}
              id={optionId}
              type="button"
              data-value={value}
              role="option"
              aria-selected={isActive}
              aria-label={`${optionLabelPrefix} ${value}`}
              onClick={() => {
                clearPendingSelection()
                onSelect(value)
                containerRef.current?.focus({ preventScroll: true })
              }}
              onKeyDown={handleButtonKeyDown}
              onMouseDown={(event) => event.preventDefault()}
              tabIndex={-1}
              className={cn(
                'pressable focus-outline-brand text-md mb-1 h-14 w-full snap-center rounded-2xl py-1 text-[18px] font-medium tabular-nums transition',
                isActive ? 'text-greyscale-140' : 'text-greyscale-60',
              )}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExactTimeSelector
