import type { ReactNode } from 'react'
import DesktopSidebarContainer from './DesktopSidebarContainer'

type DesktopShellProps = {
  sidebarContent: ReactNode
  children: ReactNode
}

/** Shared layout for desktop routes: fixed sidebar + constrained main area */
const DesktopShell = ({ sidebarContent, children }: DesktopShellProps) => (
  <div className="relative flex h-screen overflow-hidden bg-slate-100">
    <DesktopSidebarContainer>{sidebarContent}</DesktopSidebarContainer>

    <div className="flex flex-1 justify-center overflow-y-auto bg-white">
      <main className="w-full">{children}</main>
    </div>
  </div>
)

export default DesktopShell
