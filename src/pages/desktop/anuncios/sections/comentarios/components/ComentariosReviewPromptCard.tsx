import Button from '@components/ui/Button'

const ComentariosReviewPromptCard = ({ clientName }: { clientName: string }) => (
  <div className="flex flex-col gap-4 rounded-lg bg-professional-20 p-5 text-pinned-greyscale-140">
    <p className="text-xl leading-7 font-semibold text-pinned-navy">
      Descubre tu valoración
    </p>
    <p className="text-base">
      ¿Quieres ver qué valoración te ha puesto {clientName}?
    </p>
    <p className="text-base">¡Valora el servicio para verla!</p>

    <Button variant="primary" className="mt-1" fullWidth>
      Valorar servicio
    </Button>
  </div>
)

export default ComentariosReviewPromptCard
