import { ReceiptEuro } from 'lucide-react'

import SectionDivider from '@components/ui/SectionDivider'
import AnunciosSection from '../AnunciosSection'
import ServiciosAccordionRow from './servicios/components/ServiciosAccordionRow'
import { servicesData } from './servicios/data/servicesData'

const ServiciosNotice = () => (
  <div className="bg-greyscale-20 text-pinned-greyscale-140 inline-flex w-fit items-center gap-2 rounded-sm px-4 py-2 text-sm">
    <ReceiptEuro className="h-4 w-4" strokeWidth={2.5} aria-hidden />
    Surcharge for orders below:
    <span className="font-semibold">23€</span>
  </div>
)

const ServiciosSection = () => (
  <AnunciosSection title="My services">
    <div className="flex flex-col gap-4">
      <ServiciosNotice />
      <div className="px-6">
        {servicesData.map((service) => (
          <ServiciosAccordionRow key={service.id} service={service} depth={0} />
        ))}
      </div>
      <SectionDivider />
    </div>
  </AnunciosSection>
)

export default ServiciosSection
