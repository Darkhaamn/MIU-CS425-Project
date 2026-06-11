import { useEffect, useState } from 'react'
import { customerApi } from '../../api'
import { ApiClientError } from '../../api/client'
import DashboardShell from '../../components/DashboardShell'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Booking } from '../../types'

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    setLoading(true)
    customerApi.bookings().then(setBookings).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async () => {
    if (!cancelId) return
    setCancelling(true)
    try {
      await customerApi.cancelBooking(cancelId)
      setMessage('Booking cancelled successfully')
      setCancelId(null)
      load()
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Cancel failed')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader title="My bookings" subtitle="View and manage your reservations" />
      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="When you book a car, it will appear here." />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.bookingId}>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {b.cars.map((c) => `${c.brand} ${c.model}`).join(', ')}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(b.pickupDate)} – {formatDate(b.returnDate)}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={b.bookingStatus === 'CONFIRMED' ? 'success' : 'muted'}>{b.bookingStatus}</Badge>
                    {b.payment && <Badge variant="default">{b.payment.paymentStatus}</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(b.totalPrice)}</p>
                  {b.bookingStatus === 'CONFIRMED' && (
                    <Button variant="outline" size="sm" onClick={() => setCancelId(b.bookingId)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={cancelId !== null}
        onClose={() => setCancelId(null)}
        title="Cancel booking?"
        description="This will release the vehicle and process a refund if applicable."
        confirmLabel="Cancel booking"
        variant="danger"
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </DashboardShell>
  )
}
