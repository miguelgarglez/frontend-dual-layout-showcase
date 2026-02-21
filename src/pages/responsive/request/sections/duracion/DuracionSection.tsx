import { useId, useMemo } from 'react'
import SectionHeader from '@components/layout/SectionHeader'
import './duration-slider.css'
import { useResponsiveRequestForm } from '../../context/ResponsiveRequestFormContext'
import { durationSliderConfig } from '../../context/responsiveRequestFormState'

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const paddedMinutes = minutes.toString().padStart(2, '0')

  return `${hours}h ${paddedMinutes}min`
}

type DurationSliderProps = {
  id: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

const DurationSlider = ({
  id,
  value,
  min,
  max,
  step,
  onChange,
}: DurationSliderProps) => {
  const sliderProgress = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="relative h-10">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuetext={formatDuration(value)}
          className="duration-slider-input focus-outline-brand absolute inset-0 z-10 h-full w-full cursor-pointer touch-none"
        />
        <div className="bg-greyscale-80 pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full">
          <div
            className="bg-client-100 h-full rounded-full"
            style={{ width: `${sliderProgress}%` }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span
            className="absolute top-1/2 block h-8 w-8 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${sliderProgress}%` }}
          >
            <span className="bg-client-100 absolute inset-0 rounded-full shadow-(--shadow-positive-1)" />
            <span className="bg-basic-white absolute top-1/2 left-1/2 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </span>
        </div>
      </div>
    </div>
  )
}

const DuracionSection = () => {
  const sliderId = useId()
  const {
    state: { durationMinutes },
    actions: { setDurationMinutes },
  } = useResponsiveRequestForm()
  const formattedDuration = useMemo(
    () => formatDuration(durationMinutes),
    [durationMinutes],
  )

  return (
    <section className="space-y-4">
      <SectionHeader
        headingTone="neutral"
        title="Duration"
        titleSpacing="compact"
        titleAddonPlacement="inline"
        titleAddon={
          <span className="text-client-100 text-xl font-semibold">
            {formattedDuration}
          </span>
        }
      />
      <label htmlFor={sliderId} className="sr-only">
        Select how long the service will take
      </label>
      <DurationSlider
        id={sliderId}
        value={durationMinutes}
        min={durationSliderConfig.min}
        max={durationSliderConfig.max}
        step={durationSliderConfig.step}
        onChange={(value) => setDurationMinutes(value)}
      />
    </section>
  )
}

export default DuracionSection
