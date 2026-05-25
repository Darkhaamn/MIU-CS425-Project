import { DollarSign, Calendar, Shield, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description: 'We offer competitive rates with no hidden fees. Find a lower price and we will match it.',
  },
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book your perfect car in minutes with our streamlined online reservation system.',
  },
  {
    icon: Shield,
    title: 'Full Insurance',
    description: 'Drive with peace of mind knowing you are covered with comprehensive insurance options.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is always available to assist you anytime, anywhere.',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            The DriveEase Advantage
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience hassle-free car rentals with premium service and unbeatable value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
