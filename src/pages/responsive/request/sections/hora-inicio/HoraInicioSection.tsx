import { useId } from 'react'
import SectionHeader from '@components/layout/SectionHeader'
import SegmentedControl from '@components/ui/SegmentedControl'
import TimeRangeSelector from './components/TimeRangeSelector'
import ExactTimeSelector from './components/ExactTimeSelector'
import {
  useResponsiveRequestForm,
  type TimeSelectionMode,
} from '../../context/ResponsiveRequestFormContext'

const selectionModes: Array<{ value: TimeSelectionMode; title: string }> = [
  { value: 'range', title: 'Inicio flexible' },
  { value: 'exact', title: 'Inicio exacto' },
]

const HoraInicioSection = () => {
  const {
    state: {
      timeSelectionMode,
      timeRangeId,
      exactStartTime: { hour: selectedHour, minute: selectedMinute },
    },
    actions: {
      setTimeSelectionMode,
      setTimeRangeId,
      setExactHour,
      setExactMinute,
    },
  } = useResponsiveRequestForm()
  const tabBaseId = useId()

  const segmentedOptions = selectionModes.map((option) => ({
    ...option,
    tabId: `${tabBaseId}-tab-${option.value}`,
    panelId: `${tabBaseId}-panel-${option.value}`,
  }))

  return (
    <section className="space-y-4">
      <SectionHeader
        headingTone="neutral"
        title="Hora de inicio"
        titleSpacing="compact"
      />
      <div className="space-y-6 py-5">
        <div className="bg-greyscale-40/70 rounded-full p-1">
          <SegmentedControl
            ariaLabel="Tipo de hora de inicio"
            value={timeSelectionMode}
            options={segmentedOptions}
            onChange={setTimeSelectionMode}
            variant="pill"
            renderOptionContent={(option) => option.title}
          />
        </div>
        {segmentedOptions.map((option) => {
          const isActive = option.value === timeSelectionMode

          return (
            <div
              key={option.value}
              id={option.panelId}
              role="tabpanel"
              aria-labelledby={option.tabId}
              hidden={!isActive}
              aria-hidden={!isActive}
            >
              {isActive &&
                (option.value === 'range' ? (
                  <TimeRangeSelector
                    selectedRangeId={timeRangeId}
                    onSelectRange={setTimeRangeId}
                  />
                ) : (
                  <ExactTimeSelector
                    selectedHour={selectedHour}
                    selectedMinute={selectedMinute}
                    onSelectHour={setExactHour}
                    onSelectMinute={setExactMinute}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HoraInicioSection
