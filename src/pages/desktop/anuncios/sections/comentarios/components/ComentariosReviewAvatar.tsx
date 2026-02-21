import FallbackImage from '@components/ui/FallbackImage'
import type { ReviewParticipant } from '../types'

type ComentariosReviewAvatarProps = {
  person: ReviewParticipant
  className: string
}

const ComentariosReviewAvatar = ({ person, className }: ComentariosReviewAvatarProps) => (
  <FallbackImage
    as="div"
    src={person.avatar}
    alt={`Avatar of ${person.name}`}
    className={className}
    imageClassName="object-cover"
  />
)

export default ComentariosReviewAvatar
