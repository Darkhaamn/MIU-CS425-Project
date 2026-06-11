import Card, { CardBody } from './Card'

export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon?: string
}) {
  return (
    <Card hover>
      <CardBody className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardBody>
    </Card>
  )
}
