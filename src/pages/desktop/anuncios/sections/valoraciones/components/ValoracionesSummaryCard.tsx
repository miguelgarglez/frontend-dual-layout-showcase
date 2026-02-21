import { Star } from 'lucide-react'
import type { ReviewsSummary } from '../types'
import { formatScore } from '../utils/formatScore'

const ValoracionesSummaryCard = ({ summary }: { summary: ReviewsSummary }) => (
  <div className="text-pinned-greyscale-140 flex flex-wrap items-center gap-2">
    <p className="text-[40px] leading-none font-semibold">
      {formatScore(summary.average)}
    </p>
    <Star
      className="text-warning-100 h-10 w-10"
      strokeWidth={1}
      fill="currentColor"
      aria-hidden
    />
    <div className="text-pinned-greyscale-140 ml-1 flex flex-col text-base">
      <span className="font-semibold">{summary.status}</span>
      <span className="text-greyscale-120 text-sm">
        ({summary.totalReviews} reviews)
      </span>
    </div>
  </div>
)

export default ValoracionesSummaryCard
