import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

export default function Navbar() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/85 backdrop-blur-xl"
    >
      {/* Top orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7900]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF7900] to-[#FF5500] shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(255,121,0,0.35)' }}
            >
              <span className="text-[13px] font-black tracking-tight text-black">TW</span>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-xl border border-[#FF7900]/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Brand text */}
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white leading-tight tracking-tight">
                Employee Leave Assistant
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Zap size={11} className="text-[#FF7900] fill-[#FF7900]" />
                </motion.span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#555] leading-tight font-medium tracking-wide uppercase">
                <Sparkles size={8} className="text-[#FF7900]/70" />
                Thoughtwin IT Solutions
              </div>
            </div>
          </div>

          {/* Right side — date + status */}
          <div className="flex items-center gap-4">
            {/* Date */}
            <div className="hidden md:block text-right">
              <div className="text-[10px] text-[#444] font-medium tracking-widest uppercase">Today</div>
              <div className="text-xs font-semibold text-[#888]">{today}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
