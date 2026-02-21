import { Bolt, Drill, Hammer, RockingChair, Wrench } from 'lucide-react'

import { type ServiceRow } from '../types'

export const servicesData: ServiceRow[] = [
  {
    id: 'montaje',
    title: 'Assembly',
    icon: Bolt,
    defaultOpen: true,
    children: [
      {
        id: 'silla',
        title: 'Chair',
        icon: RockingChair,
        defaultOpen: true,
        details: [
          {
            id: 'desk-chair-premium',
            name: 'Desk chair',
            price: '29,3€',
            duration: '00:55',
          },
          {
            id: 'desk-chair-basic',
            name: 'Desk chair',
            price: '20€',
            duration: '00:55',
          },
          {
            id: 'desk-chair-home',
            name: 'Desk chair',
            price: '29,3€',
            duration: '00:55',
          },
        ],
      },
    ],
  },
  {
    id: 'colgado',
    title: 'Wall mounting',
    icon: Hammer,
    placeholder:
      'Add your wall-mounting services so clients can see your specialties.',
  },
  {
    id: 'instalacion',
    title: 'Installation',
    icon: Drill,
    placeholder:
      'Configure the installation services you want to offer from your dashboard.',
  },
  {
    id: 'pequenos-arreglos',
    title: 'Small repairs',
    icon: Wrench,
    placeholder:
      'Quick fixes you define will appear here. You can duplicate rows easily.',
  },
]
