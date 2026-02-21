import { useId, useState } from 'react'

const useGaleriaDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)

  return {
    isOpen,
    titleId,
    openDialog,
    closeDialog,
  }
}

export default useGaleriaDialog
