import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supplierApi } from '../../api'
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
import { formatCurrency } from '../../lib/utils'
import type { Car } from '../../types'

export default function SupplierCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => { setLoading(true); supplierApi.cars().then(setCars).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await supplierApi.deleteCar(deleteId)
      setMessage('Car removed')
      setDeleteId(null)
      load()
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggle = async (car: Car) => {
    try {
      await supplierApi.toggleAvailability(car.carId, !car.availabilityStatus)
      setMessage('Availability updated')
      load()
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Update failed')
    }
  }

  return (
    <DashboardShell role="SUPPLIER">
      <PageHeader title="Fleet" actions={<Link to="/supplier/cars/new" className="no-underline"><Button>Add vehicle</Button></Link>} />
      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {loading ? <Spinner /> : cars.length === 0 ? (
        <EmptyState title="No vehicles yet" description="Add your first car to start receiving bookings." action={<Link to="/supplier/cars/new" className="no-underline"><Button>Add vehicle</Button></Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cars.map((car) => (
            <Card key={car.carId}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{car.brand} {car.model}</h3>
                    <p className="text-sm text-slate-500">{car.carType} · {formatCurrency(car.pricePerDay)}/day</p>
                  </div>
                  <Badge variant={car.availabilityStatus ? 'success' : 'muted'}>{car.availabilityStatus ? 'Available' : 'Unavailable'}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/supplier/cars/${car.carId}/edit`} className="no-underline"><Button variant="outline" size="sm">Edit</Button></Link>
                  <Button variant="outline" size="sm" onClick={() => handleToggle(car)}>Toggle</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(car.carId)}>Delete</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Remove vehicle?" description="This cannot be undone." confirmLabel="Remove" variant="danger" loading={deleting} onConfirm={handleDelete} />
    </DashboardShell>
  )
}
