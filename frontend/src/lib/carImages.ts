import type { Car } from '../types'

const TYPE_IMAGES: Record<string, string> = {
  Sedan: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
  SUV: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
  Truck: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
  Electric: 'https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&auto=format&fit=crop&q=80',
  Luxury: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=80'

export function getCarImage(car: Pick<Car, 'carType' | 'brand'>) {
  if (car.carType && TYPE_IMAGES[car.carType]) {
    return TYPE_IMAGES[car.carType]
  }
  return DEFAULT_IMAGE
}

/** Stable display score for listing cards (visual only, derived from car id) */
export function getCarDisplayRating(carId: number) {
  return (4.5 + (carId % 5) * 0.1).toFixed(1)
}
