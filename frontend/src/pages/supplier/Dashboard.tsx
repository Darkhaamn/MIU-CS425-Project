import { useEffect, useState } from 'react'
import { supplierApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import StatCard from '../../components/ui/StatCard'
import type { Car, Supplier } from '../../types'

export default function SupplierDashboard() {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supplierApi.dashboard().then((d) => { setSupplier(d.supplier); setCars(d.cars) }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader
        title={supplier?.companyName || 'Dashboard'}
        subtitle="Fleet overview"
        actions={<Badge variant={supplier?.verificationStatus === 'APPROVED' ? 'success' : 'warning'}>{supplier?.verificationStatus}</Badge>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Fleet size" value={cars.length} icon="🚗" />
        <StatCard label="Available" value={cars.filter((c) => c.availabilityStatus).length} icon="✓" />
        <StatCard label="Rating" value={supplier?.rating?.toFixed(1) ?? '—'} icon="★" />
      </div>
    </DashboardShell>
  )
}
