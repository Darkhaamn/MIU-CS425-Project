import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { carsApi } from '../api'
import CarCard from '../components/CarCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import type { Car } from '../types'

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carsApi.available().then(setCars).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&auto=format&fit=crop&q=80"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
              Premium car rental
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your perfect ride
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Book instantly from trusted local suppliers. Transparent pricing, flexible dates, premium vehicles.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/cars" className="no-underline">
                <Button size="lg">Browse cars</Button>
              </Link>
              <Link to="/customer/register" className="no-underline">
                <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Available now</h2>
            <p className="mt-1 text-slate-500">Hand-picked vehicles ready to book today</p>
          </div>
          <Link to="/cars" className="hidden text-sm font-semibold text-brand-600 no-underline hover:text-brand-700 sm:block">
            View all →
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : cars.length === 0 ? (
          <p className="text-center text-slate-500">No cars available at the moment.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.slice(0, 6).map((car) => (
              <CarCard key={car.carId} car={car} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { title: 'Instant booking', desc: 'Reserve in minutes with secure checkout', icon: '⚡' },
            { title: 'Verified suppliers', desc: 'Every supplier is identity-verified', icon: '🛡️' },
            { title: 'Best price', desc: 'No hidden fees — what you see is what you pay', icon: '💎' },
          ].map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
