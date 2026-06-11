import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Report } from '../../types'

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { adminApi.reports().then(setReports).finally(() => setLoading(false)) }, [])

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Reports" />
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Card key={r.reportId}>
              <CardBody>
                <p className="text-sm text-slate-500">{r.supplierName}</p>
                <p className="mt-1 font-semibold text-slate-900">{r.reportType}</p>
                <p className="mt-2 text-xl font-bold">{formatCurrency(r.totalRevenue)}</p>
                <p className="text-sm text-slate-500">{r.totalBookings} bookings · {formatDate(r.generatedDate)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
