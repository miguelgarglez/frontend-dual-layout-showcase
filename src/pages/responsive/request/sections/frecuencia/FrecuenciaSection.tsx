import { useId } from 'react'
import SectionHeader from '@components/layout/SectionHeader'
import FrecuenciaSingleContent from './components/FrecuenciaSingleContent'
import FrecuenciaWeeklyContent from './components/FrecuenciaWeeklyContent'
import SectionDivider from '@components/ui/SectionDivider'
import SegmentedControl from '@components/ui/SegmentedControl'
import {
  useResponsiveRequestForm,
  type FrequencyValue,
} from '../../context/ResponsiveRequestFormContext'

const frequencyOptions: Array<{
  value: FrequencyValue
  title: string
  helper: string
}> = [
  {
    value: 'single',
    title: 'One-time',
    helper: 'Single job',
  },
  {
    value: 'weekly',
    title: 'Weekly',
    helper: 'Recurring',
  },
]

const FrecuenciaSection = () => {
  const {
    state: { frequencyMode, singleDateKey, weeklyDays },
    actions: {
      setFrequencyMode,
      setSingleDateKey,
      setWeeklyDays,
    },
  } = useResponsiveRequestForm()
  const tabBaseId = useId()

  const frequencyTabs = frequencyOptions.map((option) => ({
    ...option,
    tabId: `${tabBaseId}-tab-${option.value}`,
    panelId: `${tabBaseId}-panel-${option.value}`,
  }))

  return (
    <section className="space-y-4">
      <SectionHeader
        headingTone="neutral"
        title="Frequency"
        titleSpacing="compact"
      />
      <div className="space-y-6">
        <SegmentedControl
          ariaLabel="Select frequency"
          value={frequencyMode}
          options={frequencyTabs}
          onChange={setFrequencyMode}
          variant="frequency"
          renderOptionContent={(option) => (
            <>
              <span className="text-base leading-tight font-semibold">
                {option.title}
              </span>
              <span className="text-greyscale-110 text-sm">{option.helper}</span>
            </>
          )}
        />

        <SectionDivider />

        {frequencyTabs.map((option) => {
          const isActive = option.value === frequencyMode

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
                (option.value === 'single' ? (
                  <FrecuenciaSingleContent
                    selectedDateKey={singleDateKey}
                    onSelectDate={(dateKey) => setSingleDateKey(dateKey)}
                  />
                ) : (
                  <FrecuenciaWeeklyContent
                    selectedDays={weeklyDays}
                    onChangeSelectedDays={(days) => setWeeklyDays(days)}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FrecuenciaSection
