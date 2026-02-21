import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@lib/utils/cn'

type ResponsiveRequestHeaderProps = {
  title: string
  onBack?: () => void
  className?: string
}

const ResponsiveRequestHeader = ({
  title,
  onBack,
  className,
}: ResponsiveRequestHeaderProps) => {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigate('/')
  }

  return (
    <div className={cn('px-4 pt-6 pb-8', className)}>
      <button
        type="button"
        onClick={handleBack}
        className="pressable focus-outline-brand bg-supply-white-opacity-45 text-basic-white flex h-10 w-10 items-center justify-center rounded-full shadow-(--shadow-positive-1)"
        aria-label="Volver a la pantalla anterior"
      >
        <ArrowLeft
          className="h-5.5 w-5.5"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>

      <div className="mt-5">
        <h1 className="text-2xl leading-tight font-semibold">{title}</h1>
      </div>
    </div>
  )
}

export default ResponsiveRequestHeader
