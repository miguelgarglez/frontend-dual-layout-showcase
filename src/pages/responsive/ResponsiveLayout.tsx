import { useEffect, useState } from 'react'
import ResponsiveRequestHeader from './request/ResponsiveRequestHeader'
import ResponsiveRequestFooter, {
  type SubmissionFeedback,
} from './request/ResponsiveRequestFooter'
import useResponsiveBodyBackground from '@hooks/useResponsiveBodyBackground'
import ResponsiveRequestContent from './request/ResponsiveRequestContent'
import {
  ResponsiveRequestFormProvider,
  type ResponsiveRequestFormValues,
} from './request/context/ResponsiveRequestFormContext'
import ResponsiveRequestForm from './request/context/ResponsiveRequestForm'

const ResponsiveLayout = () => {
  const headerRef = useResponsiveBodyBackground()
  const [submissionFeedback, setSubmissionFeedback] = useState<SubmissionFeedback | null>(null)

  const handleFormSubmit = async (values: ResponsiveRequestFormValues) => {
    setSubmissionFeedback({
      status: 'info',
      message: 'Searching availability (mock)...',
    })

    // Mock network wait so the spinner/feedback are visible in the portfolio demo.
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock: in this showcase we log filters; a real API request would live here in production.
    console.info('Responsive request filters', values)

    setSubmissionFeedback({
      status: 'success',
      message: 'Done! Try adjusting filters to explore more results (mock).',
    })
  }

  useEffect(() => {
    if (!submissionFeedback) {
      return
    }

    const timeoutId = setTimeout(() => {
      setSubmissionFeedback(null)
    }, 2500)

    return () => clearTimeout(timeoutId)
  }, [submissionFeedback])

  return (
    <main className="bg-gradient-client text-basic-white min-h-screen">
      <div className="flex min-h-screen flex-col">
        <div ref={headerRef}>
          <ResponsiveRequestHeader title="When do you need it?" />
        </div>

        <div className="bg-basic-white text-greyscale-140 flex flex-1 flex-col rounded-t-3xl px-6 pt-6 pb-8 shadow-[0_-12px_32px_rgba(0,0,0,0.12)]">
          <ResponsiveRequestFormProvider>
            <ResponsiveRequestForm onSubmit={handleFormSubmit}>
              <div className="flex-1">
                <ResponsiveRequestContent />
              </div>
              <ResponsiveRequestFooter feedback={submissionFeedback} />
            </ResponsiveRequestForm>
          </ResponsiveRequestFormProvider>
        </div>
      </div>
    </main>
  )
}

export default ResponsiveLayout
