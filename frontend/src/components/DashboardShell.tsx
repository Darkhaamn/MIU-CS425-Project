import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'
import type { UserRole } from '../types'

interface NavItem {
  to: string
  label: string
  icon: string
}

const NAV: Record<UserRole, NavItem[]> = {
  CUSTOMER: [
    { to: '/customer/dashboard', label: 'Overview', icon: '📊' },
    { to: '/customer/bookings', label: 'My Bookings', icon: '📅' },
    { to: '/customer/profile', label: 'Profile', icon: '👤' },
    { to: '/cars', label: 'Browse Cars', icon: '🚗' },
  ],
  SUPPLIER: [
    { to: '/supplier/dashboard', label: 'Overview', icon: '📊' },
    { to: '/supplier/cars', label: 'Fleet', icon: '🚗' },
    { to: '/supplier/orders', label: 'Orders', icon: '📋' },
    { to: '/supplier/reports', label: 'Reports', icon: '📈' },
    { to: '/supplier/verification', label: 'Verification', icon: '✓' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Overview', icon: '📊' },
    { to: '/admin/customers', label: 'Customers', icon: '👥' },
    { to: '/admin/suppliers', label: 'Suppliers', icon: '🏢' },
    { to: '/admin/verifications', label: 'Verifications', icon: '✓' },
    { to: '/admin/payments', label: 'Payments', icon: '💳' },
    { to: '/admin/reports', label: 'Reports', icon: '📈' },
    { to: '/admin/admins', label: 'Admins', icon: '🔐' },
  ],
}

export default function DashboardShell({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  const items = NAV[role]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium no-underline transition-colors',
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
