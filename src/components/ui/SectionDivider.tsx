import { cn } from '@lib/utils/cn'

type SectionDividerProps = {
  className?: string
}

const baseClasses = 'h-px bg-greyscale-60'

const SectionDivider = ({ className }: SectionDividerProps) => (
  <div className={cn(baseClasses, className)} />
)

export default SectionDivider
