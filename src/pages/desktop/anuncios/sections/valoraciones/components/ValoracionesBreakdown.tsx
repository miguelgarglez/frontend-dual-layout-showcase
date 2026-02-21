import type { RatingCategory } from '../types'
import ValoracionesProgressBar from './ValoracionesProgressBar'
import { formatScore } from '../utils/formatScore'

const ValoracionesBreakdown = ({ categories }: { categories: RatingCategory[] }) => (
  <ul className="flex flex-col gap-4">
    {categories.map((category) => (
      <li key={category.id} className="flex items-center gap-4 text-sm">
        <span className="text-pinned-greyscale-140 flex-1 font-medium">
          {category.label}
        </span>
        <div className="ml-auto flex w-60 items-center gap-3">
          <ValoracionesProgressBar value={category.score} />
          <span className="w-10 text-right font-medium">
            {formatScore(category.score)}
          </span>
        </div>
      </li>
    ))}
  </ul>
)

export default ValoracionesBreakdown
