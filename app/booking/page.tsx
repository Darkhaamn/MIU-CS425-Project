'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Check, Car, User, Package, CreditCard, 
  Calendar, MapPin, ArrowLeft, ArrowRight,
  Shield, Navigation, Baby, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cars, locations } from '@/lib/data'

const steps = [
  { id: 1, name: 'Select Car & Dates', icon: Car },
  { id: 2, name: 'Your Information', icon: User },
  { id: 3, name: 'Extras', icon: Package },
  { id: 4, name: 'Payment', icon: CreditCard },
]

const extras = [
  {
    id: 'gps',
    name: 'GPS Navigation',
    description: 'Never get lost with turn-by-turn directions',
    price: 10,
    icon: Navigation,
  },
  {
    id: 'child-seat',
    name: 'Child Seat',
    description: 'Safe and comfortable for little passengers',
    price: 15,
    icon: Baby,
  },
  {
    id: 'insurance-plus',
    name: 'Premium Insurance',
    description: 'Zero deductible, full coverage protection',
    price: 25,
    icon: Shield,
  },
]

interface BookingData {
  carId: string
  pickupDate: string
  returnDate: string
  location: string
  firstName: string
  lastName: string
  email: string
  phone: string
  extras: string[]
}

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    carId: searchParams.get('carId') || '',
    pickupDate: searchParams.get('pickup') || '',
    returnDate: searchParams.get('return') || '',
    location: searchParams.get('location') || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    extras: [],
  })

  const selectedCar = cars.find((c) => c.id === bookingData.carId)

  const calculateDays = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0
    const start = new Date(bookingData.pickupDate)
    const end = new Date(bookingData.returnDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const days = calculateDays()
  const carSubtotal = selectedCar ? days * selectedCar.pricePerDay : 0
  const baseInsurance = days * 15
  const extrasTotal = bookingData.extras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId)
    return sum + (extra ? extra.price * days : 0)
  }, 0)
  const serviceFee = 25
  const total = carSubtotal + baseInsurance + extrasTotal + serviceFee

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete booking
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleExtra = (extraId: string) => {
    setBookingData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter((id) => id !== extraId)
        : [...prev.extras, extraId],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.carId && bookingData.pickupDate && bookingData.returnDate && bookingData.location
      case 2:
        return bookingData.firstName && bookingData.lastName && bookingData.email && bookingData.phone
      case 3:
        return true // Extras are optional
      case 4:
        return true
      default:
        return false
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your reservation has been confirmed. A confirmation email has been sent to {bookingData.email}.
            </p>
            <div className="bg-secondary rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold mb-4">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmation #</span>
                  <span className="font-medium">BK{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{selectedCar?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="font-medium">{bookingData.pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return</span>
                  <span className="font-medium">{bookingData.returnDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{bookingData.location}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border mt-2">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-semibold">${total}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/cars" className="flex-1">
                <Button className="w-full">Browse More Cars</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep > step.id
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium hidden sm:block ${
                        currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-12 sm:w-24 lg:w-32 mx-2 rounded ${
                        currentStep > step.id ? 'bg-primary' : 'bg-secondary'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Select Car & Dates */}
              {currentStep === 1 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Select Car & Dates</h2>
                    
                    {/* Car Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3">Select Vehicle</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cars.filter(c => c.available).slice(0, 4).map((car) => (
                          <button
                            key={car.id}
                            onClick={() => setBookingData({ ...bookingData, carId: car.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              bookingData.carId === car.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                              <Image src={car.image} alt={car.name} fill className="object-cover" />
                            </div>
                            <h3 className="font-semibold">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">${car.pricePerDay}/day</p>
                          </button>
                        ))}
                      </div>
                      <Link href="/cars" className="inline-block mt-3 text-sm text-primary hover:underline">
                        View all vehicles
                      </Link>
                    </div>

                    {/* Location & Dates */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pickup Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <select
                            value={bookingData.location}
                            onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary appearance-none"
                          >
                            <option value="">Select location</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Pickup Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="date"
                              value={bookingData.pickupDate}
                              onChange={(e) => setBookingData({ ...bookingData, pickupDate: e.target.value })}
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
                              value={bookingData.returnDate}
                              onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Customer Information */}
              {currentStep === 2 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name</label>
                          <input
                            type="text"
                            value={bookingData.firstName}
                            onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                            placeholder="John"
                            className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name</label>
                          <input
                            type="text"
                            value={bookingData.lastName}
                            onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                            placeholder="Doe"
                            className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Extras */}
              {currentStep === 3 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Choose Extras</h2>
                    <div className="space-y-4">
                      {extras.map((extra) => (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                            bookingData.extras.includes(extra.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            bookingData.extras.includes(extra.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          }`}>
                            <extra.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{extra.name}</h3>
                            <p className="text-sm text-muted-foreground">{extra.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${extra.price}/day</p>
                            <p className="text-sm text-muted-foreground">${extra.price * days} total</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {currentStep === 4 ? 'Complete Booking' : 'Continue'}
                  {currentStep < 4 && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                  
                  {selectedCar && (
                    <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={selectedCar.image} alt={selectedCar.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedCar.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedCar.brand} {selectedCar.year}</p>
                      </div>
                    </div>
                  )}

                  {bookingData.location && (
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{bookingData.location}</span>
                    </div>
                  )}
                  
                  {bookingData.pickupDate && bookingData.returnDate && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{bookingData.pickupDate} - {bookingData.returnDate}</span>
                    </div>
                  )}

                  {days > 0 && selectedCar && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">${selectedCar.pricePerDay} x {days} days</span>
                        <span>${carSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Basic Insurance</span>
                        <span>${baseInsurance}</span>
                      </div>
                      {bookingData.extras.map((extraId) => {
                        const extra = extras.find((e) => e.id === extraId)
                        return extra ? (
                          <div key={extraId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{extra.name}</span>
                            <span>${extra.price * days}</span>
                          </div>
                        ) : null
                      })}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  )}
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

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
