import { type LucideIcon } from 'lucide-react'

export type ServiceDetail = {
  id: string
  name: string
  price: string
  duration: string
}

export type ServiceRow = {
  id: string
  title: string
  icon: LucideIcon
  details?: ServiceDetail[]
  children?: ServiceRow[]
  placeholder?: string
  defaultOpen?: boolean
}
