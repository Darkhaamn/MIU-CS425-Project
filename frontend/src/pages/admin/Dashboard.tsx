import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import StatCard from '../../components/ui/StatCard'
import type { DashboardStats } from '../../types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { adminApi.stats().then(setStats).finally(() => setLoading(false)) }, [])

  if (loading) return <Spinner />

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Admin dashboard" subtitle="Platform overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Customers" value={stats?.customerCount ?? 0} icon="👥" />
        <StatCard label="Suppliers" value={stats?.supplierCount ?? 0} icon="🏢" />
        <StatCard label="Bookings" value={stats?.bookingCount ?? 0} icon="📅" />
        <StatCard label="Payments" value={stats?.paymentCount ?? 0} icon="💳" />
      </div>
    </DashboardShell>
  )
}
