'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Star, Users, Fuel, Settings2, Calendar, MapPin, 
  Shield, Check, ArrowLeft, ChevronLeft, ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cars, locations } from '@/lib/data'

const additionalImages = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
]

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const car = cars.find((c) => c.id === id)
  const [currentImage, setCurrentImage] = useState(0)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [location, setLocation] = useState('')

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car not found</h1>
            <Link href="/cars">
              <Button>Browse All Cars</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const allImages = [car.image, ...additionalImages]

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const days = calculateDays()
  const subtotal = days * car.pricePerDay
  const insurance = days * 15
  const serviceFee = 25
  const total = subtotal + insurance + serviceFee

  const handleBookNow = () => {
    if (!pickupDate || !returnDate || !location) {
      alert('Please fill in all booking details')
      return
    }
    const params = new URLSearchParams({
      carId: car.id,
      pickup: pickupDate,
      return: returnDate,
      location: location,
    })
    router.push(`/booking?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/cars" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all cars
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={allImages[currentImage]}
                    alt={car.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {car.category}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                        currentImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${car.name} view ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">{car.name}</h1>
                    <p className="text-muted-foreground">{car.brand} {car.model} {car.year}</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-muted-foreground">({car.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                    <Fuel className="w-5 h-5 text-muted-foreground" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                    <Settings2 className="w-5 h-5 text-muted-foreground" />
                    <span>{car.transmission}</span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Car Specifications</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Brand</p>
                      <p className="font-medium">{car.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Model</p>
                      <p className="font-medium">{car.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Year</p>
                      <p className="font-medium">{car.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="font-medium">{car.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Seats</p>
                      <p className="font-medium">{car.seats} passengers</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transmission</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Fuel Type</p>
                      <p className="font-medium">{car.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating</p>
                      <p className="font-medium">{car.rating} / 5.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Policy */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Insurance Coverage</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        All rentals include basic insurance coverage. Upgrade to our Premium Protection plan for complete peace of mind with zero deductible and coverage for personal belongings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold">${car.pricePerDay}</span>
                    <span className="text-muted-foreground">/day</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary appearance-none"
                        >
                          <option value="">Select location</option>
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Return Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="space-y-3 py-4 border-t border-b border-border mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">${car.pricePerDay} x {days} days</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insurance</span>
                        <span>${insurance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full"
                    disabled={!car.available}
                    onClick={handleBookNow}
                  >
                    {car.available ? 'Book Now' : 'Currently Unavailable'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Free cancellation up to 24 hours before pickup
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
