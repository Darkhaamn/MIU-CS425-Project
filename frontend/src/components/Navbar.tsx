import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors no-underline',
    isActive ? 'text-white' : 'text-slate-300 hover:text-white'
  )

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardLink =
    user?.role === 'CUSTOMER'
      ? '/customer/dashboard'
      : user?.role === 'SUPPLIER'
        ? '/supplier/dashboard'
        : user?.role === 'ADMIN'
          ? '/admin/dashboard'
          : null

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-white no-underline">
          CarShareX
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/cars" className={navLinkClass}>
            Browse
          </NavLink>
          {!user && (
            <>
              <NavLink to="/customer/login" className={navLinkClass}>
                Rent
              </NavLink>
              <NavLink to="/supplier/login" className={navLinkClass}>
                Supplier
              </NavLink>
            </>
          )}
          {user && dashboardLink && (
            <NavLink to={dashboardLink} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-slate-400">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-600 bg-transparent text-white hover:bg-slate-800">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/customer/login" className="text-sm font-medium text-slate-300 no-underline hover:text-white">
                Sign in
              </Link>
              <Link to="/customer/register" className="no-underline">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavLink to="/cars" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Browse
            </NavLink>
            {!user && (
              <>
                <NavLink to="/customer/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Rent
                </NavLink>
                <NavLink to="/supplier/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Supplier
                </NavLink>
                <NavLink to="/admin/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Admin
                </NavLink>
              </>
            )}
            {user && dashboardLink && (
              <NavLink to={dashboardLink} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Dashboard
              </NavLink>
            )}
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-600 bg-transparent text-white">
                Log out
              </Button>
            ) : (
              <Link to="/customer/register" className="no-underline" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get started</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
