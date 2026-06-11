import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { customerApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Booking, Customer } from '../../types'

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.dashboard().then((data) => {
      setCustomer(data.customer)
      setBookings(data.recentBookings)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title={`Hello, ${customer?.fullName?.split(' ')[0]}`}
        subtitle="Here's what's happening with your rentals"
        actions={
          <Link to="/cars" className="no-underline">
            <Button>Browse cars</Button>
          </Link>
        }
      />

      <Card>
        <CardBody className="overflow-x-auto">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-500">No bookings yet. Find your next ride.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Dates</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td className="py-3 font-medium text-slate-900">
                      {b.cars.map((c) => `${c.brand} ${c.model}`).join(', ')}
                    </td>
                    <td className="py-3 text-slate-600">
                      {formatDate(b.pickupDate)} – {formatDate(b.returnDate)}
                    </td>
                    <td className="py-3">{formatCurrency(b.totalPrice)}</td>
                    <td className="py-3">
                      <Badge variant={b.bookingStatus === 'CONFIRMED' ? 'success' : 'muted'}>
                        {b.bookingStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
