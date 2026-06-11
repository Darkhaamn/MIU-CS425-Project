import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/10 active:scale-[0.98]',
  secondary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 active:scale-[0.98]',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm font-semibold rounded-xl',
  lg: 'h-12 px-6 text-base font-semibold rounded-xl',
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 no-underline',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
