import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Inbox, Headset, MessageCircle, Megaphone, Users, PiggyBank } from 'lucide-react'
import AnunciosContent from './anuncios/AnunciosContent'
import NonExistingContent from '@pages/desktop/components/NonExistingContent'

const navGroupOrder = ['Servicios', 'Perfil'] as const
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
    key: 'calendario',
    title: 'Calendario',
    navGroup: 'Servicios',
    navLabel: 'Calendario',
    icon: CalendarDays,
    render: NonExistingContent,
  },
  {
    key: 'solicitudes',
    title: 'Solicitudes',
    navGroup: 'Servicios',
    navLabel: 'Solicitudes',
    icon: Inbox,
    render: NonExistingContent,
  },
  {
    key: 'mensajes',
    title: 'Mensajes',
    navGroup: 'Perfil',
    navLabel: 'Mensajes',
    icon: MessageCircle,
    render: NonExistingContent,
  },
  {
    key: 'saldo',
    title: 'Saldo',
    navGroup: 'Perfil',
    navLabel: 'Saldo',
    icon: PiggyBank,
    render: NonExistingContent,
  },
  {
    key: 'anuncios',
    title: 'Anuncios',
    navGroup: 'Perfil',
    navLabel: 'Anuncios',
    icon: Megaphone,
    render: AnunciosContent,
  },
  {
    key: 'trabajadores',
    title: 'Trabajadores',
    navGroup: 'Perfil',
    navLabel: 'Trabajadores',
    icon: Users,
    render: NonExistingContent,
  },
  {
    key: 'soporte',
    title: 'Soporte',
    navGroup: undefined,
    navLabel: 'Soporte',
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
