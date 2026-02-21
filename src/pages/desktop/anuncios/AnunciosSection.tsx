import type { ReactNode } from 'react'
import { cn } from '@lib/utils/cn'
import SectionHeader from '@components/layout/SectionHeader'

type AnunciosSectionProps = {
  title?: ReactNode
  titleAddon?: ReactNode
  children: ReactNode
  className?: string
  titleVisuallyHidden?: boolean
}

const baseClasses = ''

const AnunciosSection = ({
  title,
  titleAddon,
  children,
  className,
  titleVisuallyHidden = false,
}: AnunciosSectionProps) => (
  <section className={cn(baseClasses, className)}>
    {title ? (
      <SectionHeader
        title={title}
        titleAddon={titleAddon}
        titleVisuallyHidden={titleVisuallyHidden}
      />
    ) : null}
    <div>{children}</div>
  </section>
)

export default AnunciosSection
