import { cn } from '../../lib/utils'

export default function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-sm',
        hover && 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>
}
