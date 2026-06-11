import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { carsApi } from '../api'
import CarCard from '../components/CarCard'
import Button from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import type { Car } from '../types'

export default function BrowseCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [carType, setCarType] = useState('')

  const loadCars = async (kw = keyword, type = carType) => {
    setLoading(true)
    try {
      setCars(await carsApi.search(kw || undefined, type || undefined))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCars('', '')
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    loadCars()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse cars</h1>
        <p className="mt-1 text-slate-500">Search from our premium fleet</p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <Field label="Search">
          <Input
            placeholder="Brand or model..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Field>
        <Field label="Type">
          <Select value={carType} onChange={(e) => setCarType(e.target.value)}>
            <option value="">All types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Electric">Electric</option>
            <option value="Luxury">Luxury</option>
          </Select>
        </Field>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button type="submit" className="w-full sm:w-auto">
            Search
          </Button>
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <EmptyState title="No cars found" description="Try adjusting your search filters." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.carId} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}
