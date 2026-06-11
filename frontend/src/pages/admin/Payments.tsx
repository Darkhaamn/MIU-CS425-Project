import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import DashboardShell from '../../components/DashboardShell'
import Badge from '../../components/ui/Badge'
import Card, { CardBody } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { formatCurrency } from '../../lib/utils'
import type { Payment } from '../../types'

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { adminApi.payments().then(setPayments).finally(() => setLoading(false)) }, [])

  return (
    <DashboardShell role="ADMIN">
      <PageHeader title="Payments" />
      {loading ? <Spinner /> : (
        <Card><CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-slate-500"><th className="pb-3">Customer</th><th className="pb-3">Amount</th><th className="pb-3">Method</th><th className="pb-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p.paymentId}>
                  <td className="py-3">{p.customerName}</td>
                  <td className="py-3 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="py-3 text-slate-600">{p.paymentMethod}</td>
                  <td className="py-3"><Badge>{p.paymentStatus}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody></Card>
      )}
    </DashboardShell>
  )
}
