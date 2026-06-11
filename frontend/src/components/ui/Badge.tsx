import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'muted' | 'brand'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  muted: 'bg-slate-100 text-slate-500',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-600/20',
}

export default function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
