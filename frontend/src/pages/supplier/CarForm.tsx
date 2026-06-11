import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supplierApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Input, Select } from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'

export default function SupplierCarForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [carType, setCarType] = useState('Sedan')
  const [pricePerDay, setPricePerDay] = useState('50')
  const [availabilityStatus, setAvailabilityStatus] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    supplierApi.cars().then((cars) => {
      const car = cars.find((c) => c.carId === Number(id))
      if (car) { setBrand(car.brand); setModel(car.model); setCarType(car.carType || 'Sedan'); setPricePerDay(String(car.pricePerDay)); setAvailabilityStatus(car.availabilityStatus) }
    }).finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { brand, model, carType, pricePerDay: Number(pricePerDay), availabilityStatus }
    try {
      if (isEdit) await supplierApi.updateCar(Number(id), payload)
      else await supplierApi.addCar(payload)
      navigate('/supplier/cars')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title={isEdit ? 'Edit vehicle' : 'Add vehicle'} />
      <Card className="max-w-lg">
        <CardBody>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Brand"><Input value={brand} onChange={(e) => setBrand(e.target.value)} required /></Field>
            <Field label="Model"><Input value={model} onChange={(e) => setModel(e.target.value)} required /></Field>
            <Field label="Type">
              <Select value={carType} onChange={(e) => setCarType(e.target.value)}>
                {['Sedan', 'SUV', 'Truck', 'Electric', 'Luxury'].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Price per day"><Input type="number" min="1" step="0.01" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.checked)} /> Available for booking</label>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Add vehicle'}</Button>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
