import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import type { Customer } from '../../types'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => { setLoading(true); adminApi.customers().then(setCustomers).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await adminApi.deleteCustomer(deleteId); setDeleteId(null); load() }
    catch (err) { setError(err instanceof ApiClientError ? err.message : 'Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Customers" actions={<Link to="/admin/customers/new" className="no-underline"><Button>Add customer</Button></Link>} />
      <Alert type="error" message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : (
        <Card><CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-slate-500"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Phone</th><th className="pb-3"></th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((c) => (
                <tr key={c.userId}>
                  <td className="py-3 font-medium">{c.fullName}</td>
                  <td className="py-3 text-slate-600">{c.email}</td>
                  <td className="py-3 text-slate-600">{c.phoneNumber}</td>
                  <td className="py-3 text-right">
                    <Link to={`/admin/customers/${c.userId}/edit`} className="no-underline"><Button variant="outline" size="sm">Edit</Button></Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(c.userId)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody></Card>
      )}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete customer?" variant="danger" confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} />
    </DashboardShell>
  )
}
