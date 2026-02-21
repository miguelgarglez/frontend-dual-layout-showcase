import { useRef, type KeyboardEvent } from 'react'

import FallbackImage from '@components/ui/FallbackImage'
import type { GalleryImage } from '../types'

const GaleriaCarousel = ({ images }: { images: GalleryImage[] }) => {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) {
      return
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const scrollAmount = scroller.clientWidth * 0.8
      scroller.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div
      ref={scrollerRef}
      className="-mx-1 mb-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-1 focus-outline-brand"
      aria-label="Gallery image carousel"
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ scrollbarWidth: 'thin' }}
    >
      {images.map((image) => (
        <FallbackImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          className="h-[200px] w-[220px] min-w-[220px] shrink-0 snap-start rounded-xl border border-greyscale-80 bg-white text-center md:h-[230px] md:w-[260px] md:min-w-[260px]"
          fallbackClassName="text-base text-pinned-navy"
        />
      ))}
    </div>
  )
}

export default GaleriaCarousel
