'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Users, Fuel, Settings2, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cars } from '@/lib/data'
import { Car } from '@/lib/types'

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest'

interface Filters {
  category: string[]
  brand: string[]
  fuelType: string[]
  transmission: string[]
  seats: string[]
  priceRange: [number, number]
  available: boolean
}

const categories = ['Economy', 'Compact', 'SUV', 'Luxury', 'Sports']
const brands = [...new Set(cars.map(car => car.brand))]
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
const transmissions = ['Automatic', 'Manual']
const seatOptions = ['2', '4', '5', '7']

export default function CarsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    category: [],
    brand: [],
    fuelType: [],
    transmission: [],
    seats: [],
    priceRange: [0, 300],
    available: false,
  })

  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars]

    // Apply filters
    if (filters.category.length > 0) {
      result = result.filter(car => filters.category.includes(car.category))
    }
    if (filters.brand.length > 0) {
      result = result.filter(car => filters.brand.includes(car.brand))
    }
    if (filters.fuelType.length > 0) {
      result = result.filter(car => filters.fuelType.includes(car.fuelType))
    }
    if (filters.transmission.length > 0) {
      result = result.filter(car => filters.transmission.includes(car.transmission))
    }
    if (filters.seats.length > 0) {
      result = result.filter(car => filters.seats.includes(car.seats.toString()))
    }
    if (filters.available) {
      result = result.filter(car => car.available)
    }
    result = result.filter(
      car => car.pricePerDay >= filters.priceRange[0] && car.pricePerDay <= filters.priceRange[1]
    )

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case 'price-desc':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => b.year - a.year)
        break
    }

    return result
  }, [filters, sortBy])

  const toggleFilter = (type: keyof Filters, value: string) => {
    if (type === 'available' || type === 'priceRange') return
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v: string) => v !== value)
        : [...prev[type], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      fuelType: [],
      transmission: [],
      seats: [],
      priceRange: [0, 300],
      available: false,
    })
  }

  const activeFilterCount = 
    filters.category.length + 
    filters.brand.length + 
    filters.fuelType.length + 
    filters.transmission.length + 
    filters.seats.length + 
    (filters.available ? 1 : 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Browse Our Fleet</h1>
            <p className="text-muted-foreground">Find the perfect vehicle for your journey</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredAndSortedCars.length}</span> vehicles found
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-primary"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {/* Car Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {filteredAndSortedCars.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No vehicles match your filters</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-card overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function FilterSidebar({
  filters,
  setFilters,
  toggleFilter,
  clearFilters,
  activeFilterCount,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  toggleFilter: (type: keyof Filters, value: string) => void
  clearFilters: () => void
  activeFilterCount: number
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-sm text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Price per Day</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0] || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [Number(e.target.value) || 0, prev.priceRange[1]]
            }))}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border-0"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1] || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [prev.priceRange[0], Number(e.target.value) || 300]
            }))}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border-0"
          />
        </div>
      </div>

      {/* Category */}
      <FilterGroup
        title="Category"
        options={categories}
        selected={filters.category}
        onToggle={(value) => toggleFilter('category', value)}
      />

      {/* Brand */}
      <FilterGroup
        title="Brand"
        options={brands}
        selected={filters.brand}
        onToggle={(value) => toggleFilter('brand', value)}
      />

      {/* Fuel Type */}
      <FilterGroup
        title="Fuel Type"
        options={fuelTypes}
        selected={filters.fuelType}
        onToggle={(value) => toggleFilter('fuelType', value)}
      />

      {/* Transmission */}
      <FilterGroup
        title="Transmission"
        options={transmissions}
        selected={filters.transmission}
        onToggle={(value) => toggleFilter('transmission', value)}
      />

      {/* Seats */}
      <FilterGroup
        title="Seats"
        options={seatOptions}
        selected={filters.seats}
        onToggle={(value) => toggleFilter('seats', value)}
      />

      {/* Availability */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.available}
            onChange={(e) => setFilters(prev => ({ ...prev, available: e.target.checked }))}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span className="font-medium">Available Only</span>
        </label>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div>
      <h3 className="font-medium mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function CarCard({ car }: { car: Car }) {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!car.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-card rounded-lg font-medium">Unavailable</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
          {car.category}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.brand} {car.year}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-muted-foreground">({car.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings2 className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-foreground">${car.pricePerDay}</span>
            <span className="text-muted-foreground text-sm">/day</span>
          </div>
          <Link href={`/cars/${car.id}`}>
            <Button size="sm" disabled={!car.available}>
              {car.available ? 'Book Now' : 'Unavailable'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
