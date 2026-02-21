import {
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@lib/utils/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type SectionHeaderProps = {
  title: ReactNode
  titleAddon?: ReactNode
  titleVisuallyHidden?: boolean
  headingLevel?: HeadingLevel
  headingTone?: 'primary' | 'neutral'
  titleSpacing?: 'comfortable' | 'compact' | 'none'
  titleAddonPlacement?: 'end' | 'inline'
  className?: string
}

const headingBaseClass = 'm-0 text-[20px] font-semibold leading-6'

const headingToneClassNames: Record<NonNullable<SectionHeaderProps['headingTone']>, string> = {
  primary: 'text-pinned-navy',
  neutral: 'text-greyscale-140',
}

const renderTitleContent = (
  title: ReactNode,
  headingClassName: string,
  headingLevel: HeadingLevel,
): ReactNode => {
  if (typeof title === 'string' || typeof title === 'number') {
    const HeadingTag = `h${headingLevel}` as const
    return <HeadingTag className={headingClassName}>{title}</HeadingTag>
  }

  if (isValidElement(title) && title.type !== Fragment) {
    const element = title as ReactElement<{ className?: string }>

    return cloneElement(element, {
      className: cn(headingClassName, element.props.className),
    })
  }

  return title
}

/**
 * Shared header for responsive + desktop sections. Ensures every section exposes
 * a semantic heading (defaults to `h2`), allows optional trailing content, and
 * centralizes the typography tokens so future adjustments remain consistent.
 */
const SectionHeader = ({
  title,
  titleAddon,
  titleVisuallyHidden = false,
  headingLevel = 2,
  headingTone = 'primary',
  titleSpacing = 'comfortable',
  titleAddonPlacement = 'end',
  className,
}: SectionHeaderProps) => {
  const headingClassName = cn(headingBaseClass, headingToneClassNames[headingTone])
  const titleContent = renderTitleContent(title, headingClassName, headingLevel)
  const spacingClassName = (() => {
    if (titleVisuallyHidden) return 'sr-only'
    if (titleSpacing === 'compact') return 'mb-4'
    if (titleSpacing === 'none') return 'mb-0'
    return 'mb-6'
  })()

  return (
    <header className={cn(spacingClassName, className)}>
      {titleAddon && !titleVisuallyHidden ? (
        titleAddonPlacement === 'inline' ? (
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="flex items-baseline gap-2">{titleContent}</div>
            <div>{titleAddon}</div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>{titleContent}</div>
            <div className="shrink-0">{titleAddon}</div>
          </div>
        )
      ) : (
        titleContent
      )}
    </header>
  )
}

export default SectionHeader
