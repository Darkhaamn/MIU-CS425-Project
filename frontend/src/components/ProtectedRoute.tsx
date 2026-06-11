import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from './ui/Spinner'
import type { UserRole } from '../types'

export default function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />

  if (!user || user.role !== role) {
    const loginPath =
      role === 'CUSTOMER' ? '/customer/login' : role === 'SUPPLIER' ? '/supplier/login' : '/admin/login'
    return <Navigate to={loginPath} replace />
  }

  return <>{children}</>
}
