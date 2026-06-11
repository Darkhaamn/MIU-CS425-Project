import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { carsApi } from '../api'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card, { CardBody } from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { getCarDisplayRating, getCarImage } from '../lib/carImages'
import { formatCurrency } from '../lib/utils'
import type { Car, Review } from '../types'

export default function CarDetails() {
  const { id } = useParams()
  const carId = Number(id)
  const [car, setCar] = useState<Car | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : getCarDisplayRating(carId)

  useEffect(() => {
    if (!carId) return
    Promise.all([carsApi.get(carId), carsApi.reviews(carId)])
      .then(([carData, reviewData]) => {
        setCar(carData)
        setReviews(reviewData)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [carId])

  if (loading) return <Spinner />
  if (error || !car) return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Alert type="error" message={error || 'Car not found'} />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={getCarImage(car)}
              alt={`${car.brand} ${car.model}`}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <Card className="mt-6">
            <CardBody>
              <h2 className="text-lg font-semibold text-slate-900">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {reviews.map((review) => (
                    <li key={review.reviewId} className="py-4 first:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                        <span className="text-sm font-medium text-slate-900">{review.customerName}</span>
                        <span className="text-xs text-slate-400">{review.reviewDate}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {car.carType && <Badge variant="brand">{car.carType}</Badge>}
                <Badge variant={car.availabilityStatus ? 'success' : 'muted'}>
                  {car.availabilityStatus ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                {car.brand} {car.model}
              </h1>
              <p className="mt-1 text-slate-500">Supplied by {car.supplierName}</p>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg text-amber-500">★</span>
                <span className="font-semibold">{avgRating}</span>
                <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(car.pricePerDay)}</p>
                <p className="text-sm text-slate-500">per day</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {car.availabilityStatus && (
                  <Link to={`/customer/book/${car.carId}`} className="no-underline">
                    <Button className="w-full" size="lg">
                      Book this car
                    </Button>
                  </Link>
                )}
                <Link to={`/customer/reviews/new?carId=${car.carId}`} className="no-underline">
                  <Button variant="outline" className="w-full">
                    Write a review
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
