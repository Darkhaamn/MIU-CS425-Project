import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedCars } from '@/components/home/featured-cars'
import { BenefitsSection } from '@/components/home/benefits-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCars />
        <BenefitsSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
