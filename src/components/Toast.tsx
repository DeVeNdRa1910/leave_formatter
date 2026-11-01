import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import type { Toast as ToastType } from '../types/leave'

interface Props {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const styles = {
  success: {
    wrapper: 'border-green-500/20 bg-[#0D1A0D]',
    icon: 'text-green-400',
    bar: 'bg-green-500',
  },
  error: {
    wrapper: 'border-red-500/20 bg-[#1A0D0D]',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  info: {
    wrapper: 'border-[#FF7900]/20 bg-[#1A0F00]',
    icon: 'text-[#FF9A3D]',
    bar: 'bg-[#FF7900]',
  },
}

export default function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-5 right-4 z-[100] flex flex-col-reverse gap-2.5 max-w-sm w-full sm:w-auto px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          const s = styles[toast.type]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`relative overflow-hidden flex items-start gap-3 rounded-2xl border ${s.wrapper} px-4 py-3.5 shadow-2xl backdrop-blur-xl`}
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {/* Animated left bar */}
              <motion.div
                className={`absolute left-0 top-0 bottom-0 w-0.5 ${s.bar}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originY: 0 }}
              />

              <Icon size={16} className={`shrink-0 mt-0.5 ${s.icon}`} />

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white leading-snug">{toast.message}</span>
              </div>

              <motion.button
                onClick={() => onDismiss(toast.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="shrink-0 rounded-md p-0.5 text-[#555] transition-colors hover:text-white"
              >
                <X size={13} />
              </motion.button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
