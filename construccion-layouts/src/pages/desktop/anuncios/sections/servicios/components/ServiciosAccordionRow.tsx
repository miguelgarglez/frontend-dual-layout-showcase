import { ChevronDown, ChevronRight } from 'lucide-react'

import { cn } from '@lib/utils/cn'

import ServiciosDetailsTable from './ServiciosDetailsTable'
import { useServiciosAccordionRow } from '../hooks/useServiciosAccordionRow'
import { type ServiceRow } from '../types'

type ServiciosAccordionRowProps = {
  service: ServiceRow
  depth?: number
}

const ServiciosAccordionRow = ({ service, depth = 0 }: ServiciosAccordionRowProps) => {
  const hasExpandableContent =
    Boolean(service.children && service.children.length > 0) ||
    Boolean(service.details && service.details.length > 0) ||
    Boolean(service.placeholder)

  const { isOpen, toggle, contentId } = useServiciosAccordionRow({
    id: service.id,
    defaultOpen: Boolean(service.defaultOpen),
    hasExpandableContent,
  })

  return (
    <div className="border-greyscale-60 border-t">
      <ServiciosRowHeader
        service={service}
        isOpen={isOpen}
        hasExpandableContent={hasExpandableContent}
        contentId={contentId}
        onToggle={toggle}
      />

      {hasExpandableContent ? (
        <ServiciosRowContent
          service={service}
          isOpen={isOpen}
          contentId={contentId}
          depth={depth}
        />
      ) : null}
    </div>
  )
}

type ServiciosRowHeaderProps = {
  service: ServiceRow
  isOpen: boolean
  hasExpandableContent: boolean
  contentId?: string
  onToggle: () => void
}

const ServiciosRowHeader = ({
  service,
  isOpen,
  hasExpandableContent,
  contentId,
  onToggle,
}: ServiciosRowHeaderProps) => {
  const Icon = service.icon

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={hasExpandableContent ? contentId : undefined}
      className={cn(
        'pressable focus-outline-brand text-pinned-greyscale-140 flex w-full items-center gap-4 py-4 text-left transition-colors',
        hasExpandableContent ? 'hover:bg-greyscale-20' : 'cursor-default',
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <Icon className="h-8 w-8" strokeWidth={1} />
      </span>
      <span
        className={cn(
          'flex-1 text-base transition-[font-weight] duration-200',
          isOpen ? 'font-semibold' : 'font-normal',
        )}
      >
        {service.title}
      </span>
      <span className="text-greyscale-100 ml-auto">
        {hasExpandableContent ? (
          isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )
        ) : (
          <ChevronRight className="h-5 w-5 opacity-0" />
        )}
      </span>
    </button>
  )
}

type ServiciosRowContentProps = {
  service: ServiceRow
  isOpen: boolean
  contentId: string
  depth: number
}

const ServiciosRowContent = ({
  service,
  isOpen,
  contentId,
  depth,
}: ServiciosRowContentProps) => {
  const hasChildrenRows = Boolean(service.children?.length)

  return (
    <div
      className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      id={contentId}
      aria-hidden={!isOpen}
    >
      <div
        className={cn('overflow-hidden', hasChildrenRows && 'pl-10')}
        inert={isOpen ? undefined : true}
      >
        <div className="flex flex-col gap-4">
          {service.children?.map((child) => (
            <ServiciosAccordionRow key={child.id} service={child} depth={depth + 1} />
          ))}

          {service.details ? <ServiciosDetailsTable details={service.details} /> : null}

          {service.placeholder ? (
            <ServiciosPlaceholderNotice message={service.placeholder} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

const ServiciosPlaceholderNotice = ({ message }: { message: string }) => (
  <p className="text-greyscale-120 rounded-lg border border-dashed border-greyscale-60 bg-greyscale-20 px-4 py-3 text-sm">
    {message}
  </p>
)

export default ServiciosAccordionRow
