import { ChevronRight, ChevronUp } from 'lucide-react'
import AnunciosSection from '../AnunciosSection'
import SectionDivider from '@components/ui/SectionDivider'

const tier = {
  name: 'Plata',
  progress: 'Logros: 1 de 4',
}

const NivelBadge = () => (
  <span className="border-silver-border flex h-12 w-12 items-center justify-center rounded-full border bg-gradient-medal-ring p-1 shadow-sm">
    <span className="bg-gradient-medal-silver flex h-9 w-9 items-center justify-center rounded-full">
      {/* Replace this with the selected product brand icon/logo */}
      <ChevronUp className="h-6 w-6 text-white" strokeWidth={5} />
    </span>
  </span>
)

const NivelDialogTriggerIndicator = () => (
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white-opacity-25">
    <ChevronRight className="h-6 w-6 text-white" strokeWidth={2.5} />
  </span>
)

const NivelButton = () => (
  <button
    type="button"
    className="pressable focus-outline-brand flex items-center gap-4 rounded-xl bg-gradient-bg-silver-medal px-6 py-2 text-white shadow-sm"
  >
    <NivelBadge />

    <div className="flex flex-1 flex-col items-center text-center">
      <p className="text-lg leading-tight font-semibold">{tier.name}</p>
      <p className="text-sm font-normal text-white">{tier.progress}</p>
    </div>

    <NivelDialogTriggerIndicator />
  </button>
)

const NivelSection = () => (
  <AnunciosSection title="Nivel">
    <div className="flex flex-col gap-6">
      <NivelButton />
      <SectionDivider />
    </div>
  </AnunciosSection>
)

export default NivelSection
