import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Input } from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'

export default function AdminCustomerForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    adminApi.getCustomer(Number(id)).then((c) => {
      setFullName(c.fullName); setEmail(c.email); setPhoneNumber(c.phoneNumber || ''); setAddress(c.address || '')
    }).finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { fullName, email, phoneNumber, address, password: password || undefined }
    try {
      if (isEdit) await adminApi.updateCustomer(Number(id), payload)
      else await adminApi.createCustomer(payload)
      navigate('/admin/customers')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title={isEdit ? 'Edit customer' : 'New customer'} />
      <Card className="max-w-lg"><CardBody>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></Field>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Phone"><Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></Field>
          <Field label="Address"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          <Field label={`Password${isEdit ? ' (optional)' : ''}`}><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEdit} /></Field>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </form>
      </CardBody></Card>
    </DashboardShell>
  )
}
