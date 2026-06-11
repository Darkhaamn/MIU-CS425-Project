import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { customerApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Input } from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'

export default function CustomerProfile() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    customerApi.profile().then((c) => {
      setFullName(c.fullName)
      setPhoneNumber(c.phoneNumber || '')
      setAddress(c.address || '')
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await customerApi.updateProfile({ fullName, phoneNumber, address, password: password || undefined })
      setSuccess('Profile updated')
      setPassword('')
      setTimeout(() => navigate('/customer/dashboard'), 1200)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader title="Profile" subtitle="Update your personal information" />
      <Card className="max-w-lg">
        <CardBody>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Field>
            <Field label="Phone">
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </Field>
            <Field label="Address">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
            <Field label="New password (optional)">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" />
            </Field>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
