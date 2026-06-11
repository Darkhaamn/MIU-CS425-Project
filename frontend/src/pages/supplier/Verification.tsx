import { useEffect, useState } from 'react'
import { supplierApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Badge from '../../components/ui/Badge'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import type { Verification } from '../../types'

export default function SupplierVerification() {
  const [verification, setVerification] = useState<Verification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supplierApi.verification().then(setVerification).catch(() => setVerification(null)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title="Verification" subtitle="Your supplier verification status" />
      {!verification ? (
        <p className="text-slate-500">No verification record found.</p>
      ) : (
        <Card className="max-w-lg">
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Status</span>
              <Badge variant={verification.verificationStatus === 'APPROVED' ? 'success' : 'warning'}>{verification.verificationStatus}</Badge>
            </div>
            <p className="text-sm"><span className="text-slate-500">Type:</span> {verification.verificationType}</p>
            <p className="text-sm"><span className="text-slate-500">Face recognition:</span> {verification.faceRecognitionResult || '—'}</p>
            <p className="text-sm"><span className="text-slate-500">Verified at:</span> {verification.verifiedAt || '—'}</p>
            {verification.documents.length > 0 && (
              <ul className="border-t border-slate-100 pt-4 text-sm text-slate-600">
                {verification.documents.map((d) => (
                  <li key={d.documentId} className="py-1">{d.documentType} — {d.documentURL}</li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}
    </DashboardShell>
  )
}
