import type { FaqAnswer } from '../types'
import PreguntasCleaningOptionsList from './PreguntasCleaningOptionsList'
import PreguntasTextAnswer from './PreguntasTextAnswer'

const PreguntasAnswerBlock = ({ answer }: { answer: FaqAnswer }) => {
  if (answer.type === 'text') {
    return <PreguntasTextAnswer content={answer.content} />
  }

  return <PreguntasCleaningOptionsList options={answer.options} />
}

export default PreguntasAnswerBlock
