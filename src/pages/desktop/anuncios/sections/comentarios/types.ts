export type ReviewParticipant = {
  name: string
  avatar: string
}

export type HighlightedReview = {
  client: ReviewParticipant
  worker: ReviewParticipant
  serviceDaysAgo: number
}
