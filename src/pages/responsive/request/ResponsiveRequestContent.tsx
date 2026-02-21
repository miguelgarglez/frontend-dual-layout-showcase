import { Fragment } from 'react'
import SectionDivider from '@components/ui/SectionDivider'
import FrecuenciaSection from '../request/sections/frecuencia/FrecuenciaSection'
import DuracionSection from '../request/sections/duracion/DuracionSection'
import HoraInicioSection from '../request/sections/hora-inicio/HoraInicioSection'

const responsiveSections = [
  { key: 'frecuencia', Component: FrecuenciaSection },
  { key: 'duracion', Component: DuracionSection },
  { key: 'hora-inicio', Component: HoraInicioSection },
] as const

const ResponsiveRequestContent = () => (
  <div className="space-y-6">
    {responsiveSections.map(({ key, Component }, index) => (
      <Fragment key={key}>
        <Component />
        {index < responsiveSections.length - 1 ? <SectionDivider /> : null}
      </Fragment>
    ))}
  </div>
)

export default ResponsiveRequestContent
