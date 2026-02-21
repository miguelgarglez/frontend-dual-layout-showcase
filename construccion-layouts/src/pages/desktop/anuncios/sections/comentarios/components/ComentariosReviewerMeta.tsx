import type { ReviewParticipant } from '../types'
import { formatDaysAgo } from '../data/highlightedReview'

type ComentariosReviewerMetaProps = {
  client: ReviewParticipant
  serviceDaysAgo: number
}

const ComentariosReviewerMeta = ({
  client,
  serviceDaysAgo,
}: ComentariosReviewerMetaProps) => (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <p className="text-greyscale-140 text-base font-medium">{client.name}</p>
    <span className="text-greyscale-120 text-sm">
      · {formatDaysAgo(serviceDaysAgo)}
    </span>
  </div>
)

export default ComentariosReviewerMeta
