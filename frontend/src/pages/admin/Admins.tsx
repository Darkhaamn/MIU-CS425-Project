import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { adminApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import type { Admin } from '../../types'

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => { setLoading(true); adminApi.admins().then(setAdmins).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminApi.createAdmin({ fullName, email, password, role: 'ADMIN' })
      setMessage('Admin created'); setFullName(''); setEmail(''); setPassword(''); load()
    } catch (err) { setError(err instanceof ApiClientError ? err.message : 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await adminApi.deleteAdmin(deleteId); setDeleteId(null); load() }
    catch (err) { setError(err instanceof ApiClientError ? err.message : 'Failed') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Administrators" />
      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <Card className="mb-6 max-w-lg"><CardBody>
        <h2 className="mb-4 font-semibold text-slate-900">Create admin</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></Field>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
        </form>
      </CardBody></Card>

      {loading ? <Spinner /> : (
        <Card><CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-slate-500"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th></th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {admins.map((a) => (
                <tr key={a.adminId}>
                  <td className="py-3 font-medium">{a.fullName}</td>
                  <td className="py-3 text-slate-600">{a.email}</td>
                  <td className="py-3 text-slate-600">{a.role}</td>
                  <td className="py-3 text-right"><Button variant="ghost" size="sm" onClick={() => setDeleteId(a.adminId)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody></Card>
      )}

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete admin?" variant="danger" confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} />
    </DashboardShell>
  )
}
