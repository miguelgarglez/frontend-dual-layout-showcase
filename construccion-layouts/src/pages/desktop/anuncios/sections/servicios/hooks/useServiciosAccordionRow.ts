import { useCallback, useMemo, useState } from 'react'

type UseServiciosAccordionRowProps = {
  id: string
  defaultOpen?: boolean
  hasExpandableContent: boolean
}

export const useServiciosAccordionRow = ({
  id,
  defaultOpen,
  hasExpandableContent,
}: UseServiciosAccordionRowProps) => {
  const [isOpen, setIsOpen] = useState(() =>
    Boolean(defaultOpen && hasExpandableContent),
  )

  const toggle = useCallback(() => {
    if (!hasExpandableContent) return
    setIsOpen((prev) => !prev)
  }, [hasExpandableContent])

  const contentId = useMemo(() => `service-row-${id}`, [id])

  return {
    isOpen,
    toggle,
    contentId,
  }
}
