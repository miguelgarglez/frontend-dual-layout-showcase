type ValoracionesProgressBarProps = {
  value: number
  max?: number
}

const ValoracionesProgressBar = ({ value, max = 5 }: ValoracionesProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(value, max))
  const percentage = `${(safeValue / max) * 100}%`

  return (
    <div className="bg-greyscale-60 h-2 w-full overflow-hidden rounded-[56px]">
      <div
        className="bg-warning-100 h-full rounded-[56px]"
        style={{ width: percentage }}
      />
    </div>
  )
}

export default ValoracionesProgressBar
