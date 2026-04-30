/**
 * ErrorMessage — animated error notification with dismiss button
 */
import { AlertTriangle, X } from 'lucide-react'

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="animate-slide-down">
      <div className="glass rounded-2xl p-4 border border-red-400/30 bg-red-500/10 flex items-start gap-3">
        <AlertTriangle size={18} className="text-red-300 flex-shrink-0 mt-0.5" />
        <p className="text-red-200 text-sm font-body flex-1 leading-relaxed">{message}</p>
        <button
          onClick={onDismiss}
          className="text-red-300/60 hover:text-red-200 transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
