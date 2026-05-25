'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { locations } from '@/lib/data'

export function HeroSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formData.location) params.set('location', formData.location)
    if (formData.pickupDate) params.set('pickup', formData.pickupDate)
    if (formData.returnDate) params.set('return', formData.returnDate)
    if (formData.carType) params.set('category', formData.carType)
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[85vh] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
            Premium Car Rentals
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 text-balance">
            Find Your Perfect Ride Today
          </h1>
          <p className="text-lg text-background/80 leading-relaxed mb-10 max-w-xl">
            Experience the freedom of the open road with our premium fleet. Easy booking, competitive prices, and exceptional service.
          </p>
        </div>

        <form 
          onSubmit={handleSearch}
          className="bg-card rounded-2xl p-6 shadow-xl max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Pickup Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Return Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Car Type
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={formData.carType}
                  onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                >
                  <option value="">All types</option>
                  <option value="Economy">Economy</option>
                  <option value="Compact">Compact</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-1 flex items-end">
              <Button type="submit" size="lg" className="w-full h-[50px] text-base font-semibold rounded-xl">
                Search Cars
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-8 mt-10">
          <div className="text-background">
            <p className="text-3xl font-bold">500+</p>
            <p className="text-background/70 text-sm">Premium Vehicles</p>
          </div>
          <div className="w-px h-12 bg-background/20" />
          <div className="text-background">
            <p className="text-3xl font-bold">50K+</p>
            <p className="text-background/70 text-sm">Happy Customers</p>
          </div>
          <div className="w-px h-12 bg-background/20 hidden sm:block" />
          <div className="text-background hidden sm:block">
            <p className="text-3xl font-bold">4.9</p>
            <p className="text-background/70 text-sm">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
