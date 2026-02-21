import AnunciosSection from '../AnunciosSection'
import SectionDivider from '@components/ui/SectionDivider'
import { reviewsOverview } from './valoraciones/data/reviewsOverview'
import ValoracionesSummaryCard from './valoraciones/components/ValoracionesSummaryCard'
import ValoracionesBreakdown from './valoraciones/components/ValoracionesBreakdown'

const ValoracionesSection = () => (
  <AnunciosSection title="Valoraciones" titleVisuallyHidden>
    <div className="text-pinned-greyscale-140 flex flex-col gap-6">
      <SectionDivider />
      <ValoracionesSummaryCard summary={reviewsOverview.summary} />
      <ValoracionesBreakdown categories={reviewsOverview.breakdown} />
    </div>
  </AnunciosSection>
)

export default ValoracionesSection
