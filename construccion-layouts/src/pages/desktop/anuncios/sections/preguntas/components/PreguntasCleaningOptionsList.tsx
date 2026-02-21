import { Check } from 'lucide-react'
import type { CleaningOption } from '../types'

const PreguntasCleaningOptionsList = ({ options }: { options: CleaningOption[] }) => (
  <ul className="mt-2 space-y-2">
    {options.map((option) => (
      <li key={option.label} className="flex items-start gap-3 text-base">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-client-100" strokeWidth={2.5} />
        <span className="leading-relaxed text-pinned-greyscale-140">
          {option.label}
        </span>
      </li>
    ))}
  </ul>
)

export default PreguntasCleaningOptionsList
