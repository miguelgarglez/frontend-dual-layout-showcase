import Button from '@components/ui/Button'
import { Info } from 'lucide-react'

import { type ServiceDetail } from '../types'

type ServiciosDetailsTableProps = {
  details: ServiceDetail[]
}

const ServiciosDetailsTable = ({ details }: ServiciosDetailsTableProps) => (
  <div className="text-pinned-greyscale-140">
    <table className="w-full border-separate border-spacing-y-2 text-base">
      <caption className="sr-only">Tarifas y duración de los servicios</caption>
      <thead>
        <tr className="text-pinned-greyscale-140 text-xs font-normal tracking-wide">
          <th scope="col" className="sr-only w-[60%]">
            Servicio
          </th>
          <th scope="col" className="px-6 text-center font-normal">
            Precio
          </th>
          <th scope="col" className="px-6 text-center font-normal">
            Duración
          </th>
        </tr>
      </thead>
      <tbody>
        {details.map((detail) => (
          <tr key={detail.id}>
            <td className="w-[60%] py-2.5 pr-4 align-top">
              <div className="flex flex-col gap-1">
                <p className="text-base font-normal">{detail.name}</p>
                <Button
                  type="button"
                  variant="link"
                  size="inline"
                  linkTone="professional"
                  className="w-fit justify-start gap-1 text-sm"
                  aria-label={`Ver detalles del servicio ${detail.name}, precio ${detail.price}, duración ${detail.duration}`}
                >
                  <Info className="h-4 w-4" strokeWidth={2.5} />
                  Detalles
                </Button>
              </div>
            </td>
            <td className="px-6 py-2.5 text-center align-middle text-base font-semibold">
              {detail.price}
            </td>
            <td className="px-6 py-2.5 text-center align-middle text-base font-semibold">
              {detail.duration}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default ServiciosDetailsTable
