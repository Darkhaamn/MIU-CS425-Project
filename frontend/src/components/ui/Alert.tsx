import { cn } from '../../lib/utils'

export default function Alert({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error'
  message: string
  onClose?: () => void
}) {
  if (!message) return null

  return (
    <div
      role="alert"
      className={cn(
        'mb-4 flex items-start justify-between gap-3 rounded-xl px-4 py-3 text-sm',
        type === 'success' && 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20',
        type === 'error' && 'bg-red-50 text-red-800 ring-1 ring-red-600/20'
      )}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  )
}
