import { Link } from 'react-router-dom'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Card from './ui/Card'
import { getCarDisplayRating, getCarImage } from '../lib/carImages'
import { formatCurrency } from '../lib/utils'
import type { Car } from '../types'

interface CarCardProps {
  car: Car
  showBook?: boolean
}

export default function CarCard({ car, showBook = true }: CarCardProps) {
  const rating = getCarDisplayRating(car.carId)

  return (
    <Card hover className="group overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={getCarImage(car)}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {car.carType && <Badge variant="brand">{car.carType}</Badge>}
          {!car.availabilityStatus && <Badge variant="muted">Booked</Badge>}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          <span className="text-amber-500">★</span>
          {rating}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {car.brand} {car.model}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">{car.supplierName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">{formatCurrency(car.pricePerDay)}</p>
            <p className="text-xs text-slate-500">per day</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to={`/cars/${car.carId}`} className="flex-1 no-underline">
            <Button variant="outline" size="sm" className="w-full">
              View details
            </Button>
          </Link>
          {showBook && car.availabilityStatus && (
            <Link to={`/customer/book/${car.carId}`} className="flex-1 no-underline">
              <Button variant="primary" size="sm" className="w-full">
                Book now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
