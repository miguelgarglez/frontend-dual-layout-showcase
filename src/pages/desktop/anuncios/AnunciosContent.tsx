import AnunciosHero from './AnunciosHero'
import ComentariosSection from './sections/ComentariosSection'
import GaleriaSection from './sections/GaleriaSection'
import NivelSection from './sections/NivelSection'
import PreguntasSection from './sections/PreguntasSection'
import ValoracionesSection from './sections/ValoracionesSection'
import ServiciosSection from './sections/ServiciosSection'
import SobreMiSection from './sections/SobreMiSection'

const anunciosSections = [
  { key: 'sobre-mi', Component: SobreMiSection },
  { key: 'nivel', Component: NivelSection },
  { key: 'galeria', Component: GaleriaSection },
  { key: 'servicios', Component: ServiciosSection },
  { key: 'preguntas', Component: PreguntasSection },
  { key: 'valoraciones', Component: ValoracionesSection },
  { key: 'comentarios', Component: ComentariosSection },
] as const

const AnunciosContent = () => (
  <div className="px-5 pb-10">
    <div className="mx-auto max-w-[560px] space-y-8">
      <AnunciosHero />
      {anunciosSections.map(({ key, Component }) => (
        <Component key={key} />
      ))}
    </div>
  </div>
)

export default AnunciosContent
