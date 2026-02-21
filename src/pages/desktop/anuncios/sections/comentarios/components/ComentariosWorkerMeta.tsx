import type { ReviewParticipant } from '../types'
import ComentariosReviewAvatar from './ComentariosReviewAvatar'

const ComentariosWorkerMeta = ({ worker }: { worker: ReviewParticipant }) => (
  <div className="flex items-center gap-2 text-sm text-[#5A6476]">
    <ComentariosReviewAvatar
      person={worker}
      className="h-4 w-4 overflow-hidden rounded-full border border-greyscale-80"
    />
    <p className="text-xs font-medium text-greyscale-120">
      Service with <span className="font-semibold">{worker.name}</span>
    </p>
  </div>
)

export default ComentariosWorkerMeta
