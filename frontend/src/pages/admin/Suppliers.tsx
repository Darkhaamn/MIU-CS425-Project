import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import type { Supplier } from '../../types'

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => { setLoading(true); adminApi.suppliers().then(setSuppliers).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await adminApi.deleteSupplier(deleteId); setDeleteId(null); load() }
    catch (err) { setError(err instanceof ApiClientError ? err.message : 'Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Suppliers" />
      <Alert type="error" message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {suppliers.map((s) => (
            <Card key={s.supplierId}>
              <CardBody className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{s.companyName}</h3>
                  <p className="text-sm text-slate-500">{s.email}</p>
                  <Badge variant={s.verificationStatus === 'APPROVED' ? 'success' : 'warning'} className="mt-2">{s.verificationStatus}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(s.supplierId)}>Delete</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete supplier?" variant="danger" confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} />
    </DashboardShell>
  )
}
