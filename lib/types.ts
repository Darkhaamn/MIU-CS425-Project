export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  pricePerDay: number
  image: string
  seats: number
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission: 'Automatic' | 'Manual'
  category: 'Economy' | 'Compact' | 'SUV' | 'Luxury' | 'Sports'
  features: string[]
  available: boolean
  rating: number
  reviews: number
}

export interface Booking {
  id: string
  carId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  extras: string[]
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalBookings: number
  totalSpent: number
  joinedAt: string
}

export interface Review {
  id: string
  customerName: string
  customerImage: string
  rating: number
  comment: string
  date: string
  carName: string
}
