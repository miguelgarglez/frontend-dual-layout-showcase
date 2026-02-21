import type { FaqItem } from '../types'
import PreguntasAnswerBlock from './PreguntasAnswerBlock'

const PreguntasItemBlock = ({ faq }: { faq: FaqItem }) => (
  <div className="space-y-4">
    <dt className="text-base font-semibold text-pinned-greyscale-140">{faq.question}</dt>
    <dd>
      <PreguntasAnswerBlock answer={faq.answer} />
    </dd>
  </div>
)

export default PreguntasItemBlock
