import Button from '@components/ui/Button'
import AnunciosSection from '../AnunciosSection'
import { faqs } from './preguntas/data/faqs'
import usePreguntasFaqs from './preguntas/hooks/usePreguntasFaqs'
import PreguntasItemBlock from './preguntas/components/PreguntasItemBlock'

const PREVIEW_ITEMS = 2

const PreguntasSection = () => {
  const {
    previewFaqs,
    extraFaqs,
    hasExtraFaqs,
    isExpanded,
    toggleExpanded,
    extraContentId,
  } = usePreguntasFaqs(faqs, PREVIEW_ITEMS)

  return (
    <AnunciosSection title="A few questions about me">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <dl className="flex flex-col gap-8">
            {previewFaqs.map((faq) => (
              <PreguntasItemBlock key={faq.id} faq={faq} />
            ))}

            {hasExtraFaqs ? (
              <div
                className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out"
                style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                aria-hidden={!isExpanded}
                id={extraContentId}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-8">
                    {extraFaqs.map((faq) => (
                      <PreguntasItemBlock key={faq.id} faq={faq} />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </dl>

          {!isExpanded && hasExtraFaqs ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent via-white/70 to-white" />
          ) : null}
        </div>

        {hasExtraFaqs ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
            aria-controls={extraContentId}
          >
            {isExpanded ? 'Show less' : 'Show all'}
          </Button>
        ) : null}
      </div>
    </AnunciosSection>
  )
}

export default PreguntasSection
