import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import type { Verification } from '../../types'

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = () => { setLoading(true); adminApi.verifications().then(setVerifications).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleApprove = async (id: number) => {
    try { await adminApi.approveVerification(id); setMessage('Approved'); load() }
    catch (err) { setError(err instanceof ApiClientError ? err.message : 'Failed') }
  }

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Verifications" />
      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {verifications.map((v) => (
            <Card key={v.verificationId}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{v.supplierName}</p>
                  <p className="text-sm text-slate-500">{v.verificationType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.verificationStatus === 'APPROVED' ? 'success' : 'warning'}>{v.verificationStatus}</Badge>
                  {v.verificationStatus === 'PENDING' && <Button size="sm" onClick={() => handleApprove(v.verificationId)}>Approve</Button>}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
