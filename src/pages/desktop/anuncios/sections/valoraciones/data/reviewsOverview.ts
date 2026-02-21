import type { ReviewsOverview } from '../types'

export const reviewsOverview: ReviewsOverview = {
  summary: {
    average: 4.6,
    status: 'Very good',
    totalReviews: 53,
  },
  breakdown: [
    { id: 'service', label: 'Service', score: 5 },
    { id: 'punctuality', label: 'Punctuality', score: 3.2 },
    { id: 'friendliness', label: 'Friendliness', score: 4.1 },
    { id: 'value', label: 'Value / Price', score: 5 },
    { id: 'professionalism', label: 'Professionalism', score: 4 },
  ],
}
