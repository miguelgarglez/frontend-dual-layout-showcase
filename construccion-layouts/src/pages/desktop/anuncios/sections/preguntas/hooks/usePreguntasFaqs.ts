import { useState } from 'react'
import type { FaqItem } from '../types'

const EXTRA_CONTENT_ID = 'preguntas-extra-content'

const usePreguntasFaqs = (items: FaqItem[], previewCount: number) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const previewFaqs = items.slice(0, previewCount)
  const extraFaqs = items.slice(previewCount)
  const hasExtraFaqs = extraFaqs.length > 0

  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  return {
    previewFaqs,
    extraFaqs,
    hasExtraFaqs,
    isExpanded,
    toggleExpanded,
    extraContentId: EXTRA_CONTENT_ID,
  }
}

export default usePreguntasFaqs
