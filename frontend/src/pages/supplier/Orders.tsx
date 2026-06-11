import { useEffect, useState } from 'react'
import { supplierApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Badge from '../../components/ui/Badge'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Booking } from '../../types'

export default function SupplierOrders() {
  const [orders, setOrders] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { supplierApi.orders().then(setOrders).finally(() => setLoading(false)) }, [])

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title="Orders" subtitle="Bookings for your fleet" />
      {loading ? <Spinner /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Bookings will appear here when customers rent your cars." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.bookingId}>
              <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{o.cars.map((c) => `${c.brand} ${c.model}`).join(', ')}</p>
                  <p className="text-sm text-slate-500">{o.customerName} · {formatDate(o.pickupDate)} – {formatDate(o.returnDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatCurrency(o.totalPrice)}</span>
                  <Badge variant={o.bookingStatus === 'CONFIRMED' ? 'success' : 'muted'}>{o.bookingStatus}</Badge>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
