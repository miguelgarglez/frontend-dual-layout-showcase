import AnunciosSection from '../AnunciosSection'
import SectionDivider from '@components/ui/SectionDivider'
import { highlightedReview } from './comentarios/data/highlightedReview'
import ComentariosHighlightedReviewHeader from './comentarios/components/ComentariosHighlightedReviewHeader'
import ComentariosReviewPromptCard from './comentarios/components/ComentariosReviewPromptCard'
import ComentariosListCta from './comentarios/components/ComentariosListCta'

const ComentariosSection = () => {
  const { client, worker, serviceDaysAgo } = highlightedReview

  return (
    <AnunciosSection title="Reviews">
      <div className="space-y-6">
        <SectionDivider />
        <ComentariosHighlightedReviewHeader
          client={client}
          worker={worker}
          serviceDaysAgo={serviceDaysAgo}
        />
        <ComentariosReviewPromptCard clientName={client.name} />
        <SectionDivider />
        <ComentariosListCta />
        <SectionDivider />
      </div>
    </AnunciosSection>
  )
}

export default ComentariosSection
