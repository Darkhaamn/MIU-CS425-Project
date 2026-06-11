import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api'
import { ApiClientError } from '../../api/client'
import Alert from '../../components/ui/Alert'
import AuthLayout from '../../components/ui/AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input, Select } from '../../components/ui/Input'

export default function SupplierRegister() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      await authApi.registerSupplier({
        companyName: form.get('companyName') as string,
        supplierType: form.get('supplierType') as string,
        email: form.get('email') as string,
        password: form.get('password') as string,
      })
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/supplier/login'), 1500)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-12">
      <AuthLayout title="Become a supplier" subtitle="List your vehicles and start earning" footer={<>Have an account? <Link to="/supplier/login">Sign in</Link></>}>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Company name"><Input name="companyName" required /></Field>
          <Field label="Type">
            <Select name="supplierType" defaultValue="INDIVIDUAL">
              <option value="INDIVIDUAL">Individual</option>
              <option value="COMPANY">Company</option>
            </Select>
          </Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Password"><Input name="password" type="password" required /></Field>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
        </form>
      </AuthLayout>
    </div>
  )
}
