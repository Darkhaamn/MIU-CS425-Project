import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supplierApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Input, Select } from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { getCarImage } from '../../lib/carImages'

export default function SupplierCarForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [carType, setCarType] = useState('Sedan')
  const [pricePerDay, setPricePerDay] = useState('50')
  const [availabilityStatus, setAvailabilityStatus] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile)
    if (imageUrl) return getCarImage({ carType, brand, imageUrl })
    return null
  }, [imageFile, imageUrl, carType, brand])

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [imageFile, previewUrl])

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await supplierApi.dashboard()
        setVerificationStatus(dashboard.supplier.verificationStatus)
        if (isEdit) {
          const car = dashboard.cars.find((c) => c.carId === Number(id))
          if (car) {
            setBrand(car.brand)
            setModel(car.model)
            setCarType(car.carType || 'Sedan')
            setPricePerDay(String(car.pricePerDay))
            setAvailabilityStatus(car.availabilityStatus)
            setImageUrl(car.imageUrl ?? null)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEdit])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let finalImageUrl = imageUrl
      if (imageFile) {
        const uploaded = await supplierApi.uploadCarImage(imageFile)
        finalImageUrl = uploaded.imageUrl
      }
      if (!isEdit && !finalImageUrl) {
        setError('Please choose a car image')
        return
      }
      const payload = {
        brand,
        model,
        carType,
        pricePerDay: Number(pricePerDay),
        availabilityStatus,
        imageUrl: finalImageUrl ?? undefined,
      }
      if (isEdit) await supplierApi.updateCar(Number(id), payload)
      else await supplierApi.addCar(payload)
      navigate('/supplier/cars')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  const notApproved = !isEdit && verificationStatus !== 'APPROVED'

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title={isEdit ? 'Edit vehicle' : 'Add vehicle'} />
      {notApproved && (
        <Alert
          type="error"
          message={`Verification status: ${verificationStatus ?? 'PENDING'}. An admin must approve your supplier verification before you can add vehicles.`}
        />
      )}
      {notApproved ? (
        <Card className="max-w-lg">
          <CardBody>
            <p className="text-sm text-slate-600">
              Complete verification and wait for admin approval, then return here to list your cars.
            </p>
            <Link to="/supplier/verification" className="mt-4 inline-block no-underline">
              <Button>View verification status</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card className="max-w-lg">
          <CardBody>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label={isEdit ? 'Car image (optional — choose to replace)' : 'Car image'}>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  required={!isEdit && !imageUrl}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Car preview"
                    className="mt-3 aspect-video w-full rounded-xl object-cover"
                  />
                )}
              </Field>
              <Field label="Brand">
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </Field>
              <Field label="Model">
                <Input value={model} onChange={(e) => setModel(e.target.value)} required />
              </Field>
              <Field label="Type">
                <Select value={carType} onChange={(e) => setCarType(e.target.value)}>
                  {['Sedan', 'SUV', 'Truck', 'Electric', 'Luxury'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Price per day">
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  required
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.checked)}
                />
                Available for booking
              </label>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? 'Update' : 'Add vehicle'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </DashboardShell>
  )
}
