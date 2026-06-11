import { useEffect, useState } from 'react'
import { supplierApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Report } from '../../types'

export default function SupplierReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = () => { setLoading(true); supplierApi.reports().then(setReports).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleGenerate = async () => {
    try {
      await supplierApi.generateReport()
      setMessage('Report generated')
      load()
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Generation failed')
    }
  }

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title="Reports" actions={<Button onClick={handleGenerate}>Generate summary</Button>} />
      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <Card key={r.reportId}>
              <CardBody>
                <p className="text-sm text-slate-500">{r.reportType} · {formatDate(r.generatedDate)}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(r.totalRevenue)}</p>
                <p className="text-sm text-slate-500">{r.totalBookings} bookings</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
