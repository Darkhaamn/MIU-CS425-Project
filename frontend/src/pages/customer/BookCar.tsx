import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { carsApi, customerApi } from '../../api'
import { ApiClientError } from '../../api/client'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Input, Select } from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import { getCarImage } from '../../lib/carImages'
import { formatCurrency } from '../../lib/utils'
import type { Car } from '../../types'

export default function BookCar() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const id = Number(carId)
  const [car, setCar] = useState<Car | null>(null)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    carsApi.get(id).then(setCar).catch((err: Error) => setError(err.message)).finally(() => setLoading(false))
  }, [id])

  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 0
    const diff = (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000
    return diff > 0 ? Math.ceil(diff) : 0
  }, [pickupDate, returnDate])

  const estimatedTotal = car && days > 0 ? car.pricePerDay * days : 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await customerApi.createBooking({ carIds: [id], pickupDate, returnDate, paymentMethod })
      navigate('/customer/bookings')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (!car) return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Alert type="error" message={error || 'Car not found'} />
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Complete your booking</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardBody>
              <div className="mb-6 flex items-center gap-4">
                {['Dates', 'Payment', 'Confirm'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm font-medium ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                    {i < 2 && <span className="hidden h-px w-8 bg-slate-200 sm:block" />}
                  </div>
                ))}
              </div>

              <Alert type="error" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pickup date">
                    <Input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                  </Field>
                  <Field label="Return date">
                    <Input type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                  </Field>
                </div>
                <Field label="Payment method">
                  <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="CREDIT_CARD">Credit card</option>
                    <option value="DEBIT_CARD">Debit card</option>
                    <option value="PAYPAL">PayPal</option>
                  </Select>
                </Field>
                <Button type="submit" size="lg" className="w-full" disabled={submitting || days <= 0}>
                  {submitting ? 'Processing...' : 'Confirm booking'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <img src={getCarImage(car)} alt="" className="aspect-video w-full object-cover" />
            <CardBody>
              <Badge variant="brand">{car.carType}</Badge>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {car.brand} {car.model}
              </h2>
              <p className="text-sm text-slate-500">{car.supplierName}</p>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{formatCurrency(car.pricePerDay)} × {days || '—'} days</span>
                  <span>{days > 0 ? formatCurrency(estimatedTotal) : '—'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
                  <span>Estimated total</span>
                  <span>{days > 0 ? formatCurrency(estimatedTotal) : '—'}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
