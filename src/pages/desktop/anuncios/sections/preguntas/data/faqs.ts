import type { CleaningOption, FaqItem } from '../types'

export const cleaningOptions: CleaningOption[] = [
  {
    label: 'General home cleaning (bedrooms, bathrooms, and kitchen)',
  },
  {
    label: 'Deep cleaning',
  },
  {
    label: 'Post-renovation cleaning',
  },
]

export const faqs: FaqItem[] = [
  {
    id: 'ironing-experience',
    question: 'How much ironing experience do you have?',
    answer: {
      type: 'text',
      content: '20 years of experience',
    },
  },
  {
    id: 'cleaning-types',
    question: 'What types of cleaning services can you provide?',
    answer: {
      type: 'cleaning-options',
      options: cleaningOptions,
    },
  },
  {
    id: 'availability',
    question: 'What hours are you usually available?',
    answer: {
      type: 'text',
      content:
        'Monday to Friday from 8:00 to 18:00. Saturdays upon request.',
    },
  },
  {
    id: 'supplies',
    question: 'Do you bring your own cleaning products?',
    answer: {
      type: 'text',
      content:
        'Yes. I use eco-friendly products and can adapt if you prefer I use yours.',
    },
  },
]
