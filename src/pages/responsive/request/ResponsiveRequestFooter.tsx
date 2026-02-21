import Button from '@components/ui/Button'
import SectionDivider from '@components/ui/SectionDivider'
import { Loader2, Search } from 'lucide-react'
import { useResponsiveRequestForm } from './context/ResponsiveRequestFormContext'

type SubmissionFeedback = {
  status: 'info' | 'success' | 'error'
  message: string
}

type ResponsiveRequestFooterProps = {
  feedback?: SubmissionFeedback | null
}

const footerButtonClasses = 'font-semibold text-[14px]'

const ResponsiveRequestFooter = ({ feedback }: ResponsiveRequestFooterProps) => {
  const { resetForm, isSubmitting } = useResponsiveRequestForm()

  const feedbackToneClass = 'text-greyscale-140'
  const feedbackToneClassByStatus: Record<
    SubmissionFeedback['status'],
    string
  > = {
    info: feedbackToneClass,
    success: 'text-client-100',
    error: 'text-error-100',
  }
  const feedbackMessage = feedback?.message ?? ''
  const currentFeedbackToneClass = feedback
    ? feedbackToneClassByStatus[feedback.status] ?? feedbackToneClass
    : feedbackToneClass

  return (
    <footer className="pt-3">
      <SectionDivider className="-mx-6 mb-6" />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondaryClient"
          fullWidth
          className={footerButtonClasses}
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Skip
        </Button>
        <Button
          type="submit"
          variant="primaryClient"
          fullWidth
          className={footerButtonClasses}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2
              className="h-5 w-5 animate-spin"
              aria-hidden
              strokeWidth={2}
            />
          ) : (
            <Search className="h-5 w-5" aria-hidden strokeWidth={2} />
          )}
          Search
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`text-xs text-center ${
          feedback ? 'mt-3' : ''
        } ${currentFeedbackToneClass}`}
      >
        {feedbackMessage}
      </p>
    </footer>
  )
}

export type { SubmissionFeedback }
export default ResponsiveRequestFooter
