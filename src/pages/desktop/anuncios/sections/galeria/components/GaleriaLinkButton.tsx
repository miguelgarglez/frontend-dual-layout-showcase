import Button from '@components/ui/Button'

type GaleriaLinkButtonProps = {
  label: string
  onClick: () => void
}

const GaleriaLinkButton = ({ label, onClick }: GaleriaLinkButtonProps) => (
  <Button
    type="button"
    variant="link"
    size="inline"
    linkTone="navy"
    onClick={onClick}
  >
    {label}
  </Button>
)

export default GaleriaLinkButton
