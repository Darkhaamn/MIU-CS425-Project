import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { carsApi, customerApi } from '../../api'
import { ApiClientError } from '../../api/client'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import { Field, Select, Textarea } from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import { getCarImage } from '../../lib/carImages'
import type { Car } from '../../types'

export default function WriteReview() {
  const [searchParams] = useSearchParams()
  const carId = Number(searchParams.get('carId'))
  const navigate = useNavigate()
  const [car, setCar] = useState<Car | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!carId) return
    carsApi.get(carId).then(setCar).finally(() => setLoading(false))
  }, [carId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await customerApi.addReview({ carId, rating, comment })
      navigate(`/cars/${carId}`)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (!car) return <Alert type="error" message="Car not found" />

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <img src={getCarImage(car)} alt="" className="aspect-video w-full object-cover" />
        <CardBody>
          <h1 className="text-xl font-bold text-slate-900">Review {car.brand} {car.model}</h1>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Rating">
              <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                ))}
              </Select>
            </Field>
            <Field label="Your review">
              <Textarea required rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit review'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
