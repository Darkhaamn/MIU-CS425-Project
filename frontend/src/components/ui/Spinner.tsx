import { cn } from '../../lib/utils'

export default function Spinner({ label = 'Loading...', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)} role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  )
}
