import Button from '@components/ui/Button'

const ComentariosReviewPromptCard = ({ clientName }: { clientName: string }) => (
  <div className="flex flex-col gap-4 rounded-lg bg-professional-20 p-5 text-pinned-greyscale-140">
    <p className="text-xl leading-7 font-semibold text-pinned-navy">
      Discover your rating
    </p>
    <p className="text-base">
      Want to see the rating {clientName} left for you?
    </p>
    <p className="text-base">Rate the service to unlock it.</p>

    <Button variant="primary" className="mt-1" fullWidth>
      Rate service
    </Button>
  </div>
)

export default ComentariosReviewPromptCard
