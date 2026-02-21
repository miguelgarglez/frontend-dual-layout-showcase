import type { HighlightedReview } from '../types'

export const highlightedReview: HighlightedReview = {
  client: {
    name: 'Andrew',
    avatar: 'https://picsum.photos/id/1027/128/128',
  },
  worker: {
    name: 'Elena',
    avatar: 'https://picsum.photos/id/1011/96/96',
  },
  serviceDaysAgo: 3,
}

export const formatDaysAgo = (days: number) =>
  `Hace ${days} día${days === 1 ? '' : 's'}`
