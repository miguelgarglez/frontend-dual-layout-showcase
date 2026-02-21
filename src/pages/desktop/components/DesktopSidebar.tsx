import { type LucideIcon, Bell, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '@components/ui/Button'
import { cn } from '@lib/utils/cn'
import { desktopNavGroups, desktopNavStandalone } from '@pages/desktop/contentPages'

/** Note: could later be extended with a collapsed/off-canvas variant for smaller desktops */
const DesktopSidebar = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate('/')
  }

  return (
    <nav
      aria-label="Main navigation"
      className="bg-greyscale-20 flex h-full flex-col justify-between px-4 pt-4 pb-8"
    >
      <div className="space-y-8">
        <SidebarBrand />
        <SidebarNav />
      </div>
      <SidebarFooter onLogout={handleLogout} />
    </nav>
  )
}

const SidebarBrand = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-client-100 to-client-120 text-white shadow" />
      <p className="text-pinned-greyscale-140 text-lg font-semibold">TaskNest</p>
    </div>
    <button
      type="button"
      aria-label="notifications"
      className="pressable focus-outline-brand hover:bg-greyscale-40 relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
    >
      <Bell className="text-pinned-greyscale-140/80 h-5 w-5" />
      <span className="bg-error-100 absolute top-1 right-1.5 block h-2 w-2 rounded-full shadow" />
    </button>
  </div>
)

const navLinkBaseClass =
  'pressable focus-outline-brand flex items-center gap-3 rounded-xl p-4 text-sm font-normal transition-colors'

const SidebarNavLink = ({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: LucideIcon
}) => (
  <NavLink
    to={to}
    className={({ isActive }: { isActive: boolean }) =>
      cn(
        navLinkBaseClass,
        isActive
          ? 'bg-greyscale-60 text-pinned-greyscale-140 font-semibold'
          : 'text-pinned-greyscale-140 hover:bg-greyscale-40',
      )
    }
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </NavLink>
)

const SidebarNav = () => (
  <>
    {desktopNavGroups.map((group, index) => (
      <section
        key={group.label}
        className={cn(
          'space-y-3',
          index < desktopNavGroups.length - 1
            ? 'border-greyscale-60 border-b pb-6'
            : null,
        )}
      >
        <p className="text-pinned-greyscale-120 ml-4 text-xs uppercase">
          {group.label}
        </p>
        <ul className="space-y-1.5">
          {group.items.map((item) => (
            <li key={item.key}>
              <SidebarNavLink
                to={`/desktop/${item.key}`}
                label={item.label}
                icon={item.icon}
              />
            </li>
          ))}
        </ul>
      </section>
    ))}

    {desktopNavStandalone.length > 0 && (
      <div className="border-greyscale-60 border-t pt-6">
        <ul className="space-y-1.5">
          {desktopNavStandalone.map((item) => (
            <li key={item.key}>
              <SidebarNavLink
                to={`/desktop/${item.key}`}
                label={item.label}
                icon={item.icon}
              />
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
)

const SidebarFooter = ({ onLogout }: { onLogout: () => void }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="text-pinned-greyscale-140 mt-4 justify-start gap-2 text-sm"
    fullWidth
    onClick={onLogout}
  >
    <LogOut className="h-4 w-4" />
    <span>Sign out</span>
  </Button>
)

export default DesktopSidebar
