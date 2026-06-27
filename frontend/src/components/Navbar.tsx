import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Upload Images' },
  { to: '/manual', label: 'Manual Input' },
  { to: '/correction', label: 'Correction' },
  { to: '/solution', label: 'Solution' },
]

function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/" className="text-lg font-bold tracking-[0.2em] text-cyan-400">
          D-CUBE
        </NavLink>
        <div className="flex flex-wrap gap-1 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
