import { Link } from 'react-router-dom'

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-slate-900">
    <header className="text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Frontend showcase</p>
      <h1 className="text-3xl font-semibold">Dual layout experience</h1>
    </header>

    <nav className="flex flex-col gap-3 sm:flex-row">
      <Link className="rounded-full bg-teal-500 px-6 py-2 text-white" to="/desktop">
        Desktop flow
      </Link>
      <Link className="rounded-full border border-slate-300 px-6 py-2 text-slate-900" to="/responsive">
        Mobile-first flow
      </Link>
    </nav>
  </main>
)

export default Home
