export type RatingCategory = {
  id: string
  label: string
  score: number
}

export type ReviewsSummary = {
  average: number
  status: string
  totalReviews: number
}

export type ReviewsOverview = {
  summary: ReviewsSummary
  breakdown: RatingCategory[]
}
