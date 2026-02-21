import { type FormEvent, type ReactNode } from 'react'
import { cn } from '@lib/utils/cn'
import {
  useResponsiveRequestForm,
  type ResponsiveRequestFormValues,
} from './ResponsiveRequestFormContext'

type ResponsiveRequestFormProps = {
  children: ReactNode
  className?: string
  onSubmit?: (values: ResponsiveRequestFormValues) => void | Promise<void>
}

const ResponsiveRequestForm = ({
  children,
  className,
  onSubmit,
}: ResponsiveRequestFormProps) => {
  const { state, isSubmitting, setIsSubmitting } = useResponsiveRequestForm()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(state)
    } catch (error) {
      console.error('Responsive request form submission failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn('flex flex-1 flex-col', className)}
    >
      {children}
    </form>
  )
}

export default ResponsiveRequestForm
