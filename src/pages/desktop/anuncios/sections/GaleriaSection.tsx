import AnunciosSection from '../AnunciosSection'
import SectionDivider from '@components/ui/SectionDivider'
import GaleriaCarousel from './galeria/components/GaleriaCarousel'
import GaleriaDialog from './galeria/components/GaleriaDialog'
import GaleriaLinkButton from './galeria/components/GaleriaLinkButton'
import useGaleriaDialog from './galeria/hooks/useGaleriaDialog'
import { galleryImages } from './galeria/data/galleryImages'

const GaleriaSection = () => {
  const { isOpen, openDialog, closeDialog, titleId } = useGaleriaDialog()

  return (
    <AnunciosSection
      title="Gallery"
      titleAddon={<GaleriaLinkButton label="View gallery" onClick={openDialog} />}
    >
      {/* Future: wrap these cards in a carousel with drag/fling if the design requests it again. */}
      <GaleriaCarousel images={galleryImages} />
      <SectionDivider />
      <GaleriaDialog
        open={isOpen}
        images={galleryImages}
        onClose={closeDialog}
        titleId={titleId}
      />
    </AnunciosSection>
  )
}

export default GaleriaSection
