import Button from '@components/ui/Button'
import { Info } from 'lucide-react'

import { type ServiceDetail } from '../types'

type ServiciosDetailsTableProps = {
  details: ServiceDetail[]
}

const ServiciosDetailsTable = ({ details }: ServiciosDetailsTableProps) => (
  <div className="text-pinned-greyscale-140">
    <table className="w-full border-separate border-spacing-y-2 text-base">
      <caption className="sr-only">Service rates and duration</caption>
      <thead>
        <tr className="text-pinned-greyscale-140 text-xs font-normal tracking-wide">
          <th scope="col" className="sr-only w-[60%]">
            Service
          </th>
          <th scope="col" className="px-6 text-center font-normal">
            Price
          </th>
          <th scope="col" className="px-6 text-center font-normal">
            Duration
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
                  aria-label={`View details for service ${detail.name}, price ${detail.price}, duration ${detail.duration}`}
                >
                  <Info className="h-4 w-4" strokeWidth={2.5} />
                  Details
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
