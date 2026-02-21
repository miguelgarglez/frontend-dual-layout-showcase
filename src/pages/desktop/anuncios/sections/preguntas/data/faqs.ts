import type { CleaningOption, FaqItem } from '../types'

export const cleaningOptions: CleaningOption[] = [
  {
    label: 'Limpieza general del hogar (habitaciones, baños y cocina)',
  },
  {
    label: 'Limpieza a fondo',
  },
  {
    label: 'Limpieza después de la obra',
  },
]

export const faqs: FaqItem[] = [
  {
    id: 'ironing-experience',
    question: '¿Cuánta experiencia tienes planchando?',
    answer: {
      type: 'text',
      content: '20 años de experiencia',
    },
  },
  {
    id: 'cleaning-types',
    question: 'Indica los tipos de limpieza que puedes realizar',
    answer: {
      type: 'cleaning-options',
      options: cleaningOptions,
    },
  },
  {
    id: 'availability',
    question: '¿En qué horarios sueles estar disponible?',
    answer: {
      type: 'text',
      content:
        'De lunes a viernes de 8:00 a 18:00. Sábados bajo solicitud previa.',
    },
  },
  {
    id: 'supplies',
    question: '¿Llevas tus propios productos de limpieza?',
    answer: {
      type: 'text',
      content:
        'Sí. Utilizo productos ecológicos y puedo adaptarme si prefieres que use los tuyos.',
    },
  },
]
