import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { reviews } from '@/lib/data'

export function ReviewsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have experienced the DriveEase difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={review.customerImage}
                    alt={review.customerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{review.customerName}</h4>
                  <p className="text-sm text-muted-foreground">Rented {review.carName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-primary text-primary'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
