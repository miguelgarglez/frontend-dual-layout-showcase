import type { ReviewsOverview } from '../types'

export const reviewsOverview: ReviewsOverview = {
  summary: {
    average: 4.6,
    status: 'Muy bien',
    totalReviews: 53,
  },
  breakdown: [
    { id: 'servicio', label: 'Servicio', score: 5 },
    { id: 'puntualidad', label: 'Puntualidad', score: 3.2 },
    { id: 'amabilidad', label: 'Amabilidad', score: 4.1 },
    { id: 'calidad-precio', label: 'Calidad / Precio', score: 5 },
    { id: 'profesionalidad', label: 'Profesionalidad', score: 4 },
  ],
}
