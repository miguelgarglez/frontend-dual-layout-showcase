import Popover from '@components/ui/Popover'
import FallbackImage from '@components/ui/FallbackImage'
import type { GalleryImage } from '../types'
import GaleriaLinkButton from './GaleriaLinkButton'

type GaleriaDialogProps = {
  open: boolean
  images: GalleryImage[]
  onClose: () => void
  titleId: string
}

const GaleriaDialog = ({ open, images, onClose, titleId }: GaleriaDialogProps) => (
  <Popover open={open} onClose={onClose} labelledBy={titleId}>
    <div className="max-h-[90vh] overflow-hidden rounded-xl">
      <div className="flex items-start justify-between border-b border-greyscale-80 px-6 py-4">
        <p id={titleId} className="text-pinned-navy text-xl font-semibold">
          Full gallery
        </p>
        <GaleriaLinkButton label="Close" onClick={onClose} />
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image) => (
            <FallbackImage
              key={`dialog-${image.id}`}
              src={image.src}
              alt={image.alt}
              className="h-48 w-full overflow-hidden rounded-[20px] border border-greyscale-80 bg-white"
              imageClassName="h-full w-full object-cover"
              fallbackClassName="text-base text-pinned-navy"
            />
          ))}
        </div>
      </div>
    </div>
  </Popover>
)

export default GaleriaDialog
