// Core (non-React) scroll lock so other runtimes can reuse it without hooks.
const lockState = {
  count: 0,
  previousOverflow: '' as string | null,
}

const getDocument = () => {
  if (typeof document === 'undefined') {
    return null
  }
  return document
}

export const lockBodyScroll = () => {
  const doc = getDocument()
  if (!doc) return
  if (lockState.count === 0) {
    lockState.previousOverflow = doc.body.style.overflow
    doc.body.style.overflow = 'hidden'
  }
  lockState.count += 1
}

export const unlockBodyScroll = () => {
  const doc = getDocument()
  if (!doc || lockState.count === 0) return
  lockState.count -= 1
  if (lockState.count === 0) {
    doc.body.style.overflow = lockState.previousOverflow ?? ''
    lockState.previousOverflow = null
  }
}
