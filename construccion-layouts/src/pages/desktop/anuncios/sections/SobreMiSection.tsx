import { useId, useState, type CSSProperties } from 'react'
import { Minus, Plus } from 'lucide-react'
import Button from '@components/ui/Button'
import { cn } from '@lib/utils/cn'
import AnunciosSection from '../AnunciosSection'

// Placeholder "About me" copy; in a real app this would come from the advertiser profile data
const aboutCopy =
  'Lorem ipsum dolor sit amet consectetur. Habitant massa sollicitudin quam imperdiet leo cursus. Aliquam aliquam lorem nunc leo sit scelerisque vitae arcu sed. Ultricies lorem diam viverra lorem a. Elementum vel leo vitae tincidunt nec convallis pharetra iaculis. Cras tellus nisi enim egestas. Nisi adipiscing lectus justo nunc nisl pharetra sollicitudin risus. Proin amet id consequat velit maecenas egestas faucibus. Arcu suspendisse amet augue urna. Sapien mauris tellus in purus nibh felis aliquam ac hendrerit. Morbi at cursus amet mollis penatibus gravida donec. Accumsan aliquet pellentesque pharetra donec tortor. Magna faucibus suspendisse sed et sit. Facilisis tempor quis massa commodo massa dictumst cras.'

type LineClampVariable = CSSProperties & { '--line-clamp': number }
const collapsedLines = 6
const lineClampStyle: LineClampVariable = { '--line-clamp': collapsedLines }

const SobreMiSection = () => {
  const [expanded, setExpanded] = useState(false)
  const aboutCopyId = useId()

  return (
    <AnunciosSection title="Sobre mí">
      <div className="space-y-4">
        <p
          id={aboutCopyId}
          className={cn(
            'leading-relaxed text-pinned-greyscale-140',
            !expanded && 'line-clamp',
          )}
          // When collapsed we pass the clamp value through the CSS variable consumed by the `line-clamp` tailwind utility
          style={expanded ? undefined : lineClampStyle}
        >
          {aboutCopy}
        </p>

        <ToggleButton
          expanded={expanded}
          onToggle={() => setExpanded((prev) => !prev)}
          controlsId={aboutCopyId}
        />
      </div>
    </AnunciosSection>
  )
}

const ToggleButton = ({
  expanded,
  onToggle,
  controlsId,
}: {
  expanded: boolean
  onToggle: () => void
  controlsId: string
}) => (
  <Button
    type="button"
    variant="link"
    size="inline"
    linkTone="professional"
    aria-expanded={expanded}
    aria-controls={controlsId}
    onClick={onToggle}
    className="transition-colors duration-200"
  >
    <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <Plus
        className={cn(
          'absolute transition-all duration-200',
          expanded ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
        )}
        strokeWidth={2.5}
      />
      <Minus
        className={cn(
          'absolute transition-all duration-200',
          expanded ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
        )}
        strokeWidth={2.5}
      />
    </span>
    <span className="relative text-base font-semibold underline underline-offset-4">
      {expanded ? 'Ver menos' : 'Ver más'}
    </span>
  </Button>
)

export default SobreMiSection
