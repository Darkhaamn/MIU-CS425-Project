import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api'
import { ApiClientError } from '../../api/client'
import Alert from '../../components/ui/Alert'
import AuthLayout from '../../components/ui/AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'

export default function SupplierLogin() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      setUser(await authApi.loginSupplier(email, password))
      navigate('/supplier/dashboard')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-12">
      <AuthLayout title="Supplier login" subtitle="Manage your fleet and earnings" footer={<>New supplier? <Link to="/supplier/register">Register</Link></>}>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Password"><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </AuthLayout>
    </div>
  )
}
