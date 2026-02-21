import { Bolt, Drill, Hammer, RockingChair, Wrench } from 'lucide-react'

import { type ServiceRow } from '../types'

export const servicesData: ServiceRow[] = [
  {
    id: 'montaje',
    title: 'Montaje',
    icon: Bolt,
    defaultOpen: true,
    children: [
      {
        id: 'silla',
        title: 'Silla',
        icon: RockingChair,
        defaultOpen: true,
        details: [
          {
            id: 'desk-chair-premium',
            name: 'De escritorio',
            price: '29,3€',
            duration: '00:55',
          },
          {
            id: 'desk-chair-basic',
            name: 'De escritorio',
            price: '20€',
            duration: '00:55',
          },
          {
            id: 'desk-chair-home',
            name: 'De escritorio',
            price: '29,3€',
            duration: '00:55',
          },
        ],
      },
    ],
  },
  {
    id: 'colgado',
    title: 'Colgado',
    icon: Hammer,
    placeholder:
      'Añade tus servicios de colgado para que los clientes conozcan tus especialidades.',
  },
  {
    id: 'instalacion',
    title: 'Instalación',
    icon: Drill,
    placeholder:
      'Configura desde tu panel los servicios de instalación que quieres ofrecer.',
  },
  {
    id: 'pequenos-arreglos',
    title: 'Pequeños arreglos',
    icon: Wrench,
    placeholder:
      'Aquí aparecerán los arreglos rápidos que definas. Puedes duplicar filas fácilmente.',
  },
]
