import type { HighlightedReview } from '../types'
import ComentariosReviewAvatar from './ComentariosReviewAvatar'
import ComentariosReviewerMeta from './ComentariosReviewerMeta'
import ComentariosWorkerMeta from './ComentariosWorkerMeta'

const ComentariosHighlightedReviewHeader = ({
  client,
  worker,
  serviceDaysAgo,
}: HighlightedReview) => (
  <div className="flex gap-4">
    <ComentariosReviewAvatar
      person={client}
      className="h-11 w-11 overflow-hidden rounded-full border border-greyscale-80"
    />

    <div className="flex flex-1 flex-col gap-1">
      <ComentariosReviewerMeta client={client} serviceDaysAgo={serviceDaysAgo} />
      <ComentariosWorkerMeta worker={worker} />
    </div>
  </div>
)

export default ComentariosHighlightedReviewHeader
