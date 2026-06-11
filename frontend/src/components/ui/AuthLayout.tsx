import { Link } from 'react-router-dom'
import Card, { CardBody } from './Card'

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 no-underline">
          CarShareX
        </Link>
      </div>
      <Card>
        <CardBody>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">{footer}</div>}
        </CardBody>
      </Card>
    </div>
  )
}
