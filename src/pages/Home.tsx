import { Link } from 'react-router-dom'

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
    <header className="mx-auto w-full max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Frontend showcase</p>
      <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">
        Dual layout experience
      </h1>
    </header>

    <nav className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link className="inline-flex w-full items-center justify-center rounded-full bg-client-100 px-6 py-2 text-white transition-colors hover:bg-client-120 sm:w-auto sm:min-w-56" to="/desktop">
        Desktop flow
      </Link>
      <Link className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-2 text-slate-900 sm:w-auto sm:min-w-56" to="/responsive">
        Mobile-first flow
      </Link>
    </nav>
  </main>
)

export default Home
