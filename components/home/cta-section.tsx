import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 text-balance">
            Ready to Hit the Road?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Book your dream car today and experience the freedom of premium travel. No hidden fees, instant confirmation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/cars">
              <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                Browse Our Fleet
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Start Booking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
