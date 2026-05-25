import Link from 'next/link'
import Image from 'next/image'
import { Star, Users, Fuel, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cars } from '@/lib/data'

export function FeaturedCars() {
  const featuredCars = cars.filter(car => car.available).slice(0, 4)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Featured Vehicles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our handpicked selection of premium vehicles, from efficient city cars to powerful luxury sedans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <Card key={car.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
                  {car.category}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{car.name}</h3>
                    <p className="text-sm text-muted-foreground">{car.brand}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{car.rating}</span>
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
                    <Button size="sm">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/cars">
            <Button variant="outline" size="lg">
              View All Vehicles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
