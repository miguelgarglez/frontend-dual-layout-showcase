import FallbackImage from '@components/ui/FallbackImage'

// Placeholder profile image; should come from advertiser record once it exists
const profileImage = 'https://picsum.photos/id/237/300/300'

const AnunciosHero = () => {
  return (
    <section>
      <div className="flex flex-col items-center gap-4 text-center">
        <FallbackImage
          as="div"
          src={profileImage}
          alt="Avatar de Equipo TaskNest"
          className="h-28 w-28 overflow-hidden rounded-full border border-greyscale-80 ring-4 ring-slate-100"
          imageClassName="object-cover object-center"
          fallbackClassName="text-lg text-slate-500"
          fallbackContent="TN"
        />
        <div>
          <p className="text-lg font-semibold text-pinned-greyscale-140">Equipo TaskNest</p>
          <p className="text-base text-greyscale-120">Manitas</p>
        </div>
      </div>
    </section>
  )
}

export default AnunciosHero
