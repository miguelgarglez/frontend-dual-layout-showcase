import { useEffect } from 'react'
import { lockBodyScroll, unlockBodyScroll } from './bodyScrollLock'

// React adapter over the core lock so UI components keep the API ergonomic.
export const useBodyScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return undefined

    lockBodyScroll()
    return () => {
      unlockBodyScroll()
    }
  }, [active])
}
