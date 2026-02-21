export type CleaningOption = {
  label: string
}

export type TextAnswer = {
  type: 'text'
  content: string
}

export type CleaningAnswer = {
  type: 'cleaning-options'
  options: CleaningOption[]
}

export type FaqAnswer = TextAnswer | CleaningAnswer

export type FaqItem = {
  id: string
  question: string
  answer: FaqAnswer
}
