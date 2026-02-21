import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Inbox, Headset, MessageCircle, Megaphone, Users, PiggyBank } from 'lucide-react'
import AnunciosContent from './anuncios/AnunciosContent'
import NonExistingContent from '@pages/desktop/components/NonExistingContent'

const navGroupOrder = ['Services', 'Profile'] as const
type NavGroup = (typeof navGroupOrder)[number]

type DesktopContentPageDefinition = {
  key: string
  title: string
  navGroup?: NavGroup | undefined
  navLabel: string
  icon: LucideIcon
  render: () => ReactNode
}

/**
 * Typing note:
 * We derive the types (`DesktopContentPageKey`, `desktopContentPages`, nav) from this single array
 * so the sidebar, router, and renderer never drift apart. It introduces a bit of `typeof`+`satisfies`
 * "magic", but it keeps a single source of truth. If it ever feels too opaque, we can fall back to
 * manual types at the cost of extra maintenance.
 */
const desktopContentPageDefinitions = [
  {
    key: 'calendar',
    title: 'Calendar',
    navGroup: 'Services',
    navLabel: 'Calendar',
    icon: CalendarDays,
    render: NonExistingContent,
  },
  {
    key: 'requests',
    title: 'Requests',
    navGroup: 'Services',
    navLabel: 'Requests',
    icon: Inbox,
    render: NonExistingContent,
  },
  {
    key: 'messages',
    title: 'Messages',
    navGroup: 'Profile',
    navLabel: 'Messages',
    icon: MessageCircle,
    render: NonExistingContent,
  },
  {
    key: 'balance',
    title: 'Balance',
    navGroup: 'Profile',
    navLabel: 'Balance',
    icon: PiggyBank,
    render: NonExistingContent,
  },
  {
    key: 'listings',
    title: 'Listings',
    navGroup: 'Profile',
    navLabel: 'Listings',
    icon: Megaphone,
    render: AnunciosContent,
  },
  {
    key: 'workers',
    title: 'Workers',
    navGroup: 'Profile',
    navLabel: 'Workers',
    icon: Users,
    render: NonExistingContent,
  },
  {
    key: 'support',
    title: 'Support',
    navGroup: undefined,
    navLabel: 'Support',
    icon: Headset,
    render: NonExistingContent,
  },
] as const satisfies ReadonlyArray<DesktopContentPageDefinition>

type DesktopContentPageFromDefinitions = (typeof desktopContentPageDefinitions)[number]
export type DesktopContentPageKey = DesktopContentPageFromDefinitions['key']

export const desktopContentPages = desktopContentPageDefinitions.reduce<
  Record<DesktopContentPageKey, DesktopContentPageDefinition>
>(
  (acc, page) => {
    acc[page.key] = page
    return acc
  },
  {} as Record<DesktopContentPageKey, DesktopContentPageDefinition>
)

export const desktopNavGroups = navGroupOrder.map((group) => ({
  label: group,
  items: desktopContentPageDefinitions
    .filter((page) => page.navGroup === group)
    .map((page) => ({ key: page.key, label: page.navLabel, icon: page.icon })),
}))

export const desktopNavStandalone = desktopContentPageDefinitions
  .filter((page) => !page.navGroup)
  .map((page) => ({ key: page.key, label: page.navLabel, icon: page.icon }))
