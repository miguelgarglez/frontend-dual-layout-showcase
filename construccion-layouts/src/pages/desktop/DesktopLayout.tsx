import { Outlet } from 'react-router-dom'
import DesktopShell from '@pages/desktop/components/DesktopShell'
import DesktopSidebar from '@pages/desktop/components/DesktopSidebar'

/**
 * High-level layout for desktop routes: wraps the sidebar and delegates content to `<Outlet />`.
 * TODO: Revisit announcing page changes via a live region to improve ScreenReader feedback.
 */
const DesktopLayout = () => (
  <DesktopShell sidebarContent={<DesktopSidebar />}>
    <div className="flex flex-col gap-8">
      <Outlet />
    </div>
  </DesktopShell>
)

export default DesktopLayout
