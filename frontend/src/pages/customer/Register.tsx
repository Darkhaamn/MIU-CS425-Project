import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api'
import { ApiClientError } from '../../api/client'
import Alert from '../../components/ui/Alert'
import AuthLayout from '../../components/ui/AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Input'

export default function CustomerRegister() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      await authApi.registerCustomer({
        fullName: form.get('fullName') as string,
        email: form.get('email') as string,
        phoneNumber: form.get('phoneNumber') as string,
        password: form.get('password') as string,
        address: form.get('address') as string,
      })
      setSuccess('Account created! Redirecting to sign in...')
      setTimeout(() => navigate('/customer/login'), 1500)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-12">
      <AuthLayout
        title="Create your account"
        subtitle="Start booking premium cars today"
        footer={
          <>
            Already have an account? <Link to="/customer/login">Sign in</Link>
          </>
        }
      >
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <Input name="fullName" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Phone">
            <Input name="phoneNumber" />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" required />
          </Field>
          <Field label="Address">
            <Input name="address" />
          </Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </AuthLayout>
    </div>
  )
}
