import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = [
  { text: "Super Human is putting on its corporate tie...", emoji: "🤵" },
  { text: "Translating your reason into professional English...", emoji: "😂" },
  { text: "Adding some corporate-level politeness...", emoji: "✍️" },
  { text: "Almost done. Don't start packing yet!", emoji: "🧳" },
  { text: "Polishing every word to perfection...", emoji: "✨" },
  { text: "Making your manager feel like you actually care...", emoji: "😇" },
]

/* ── Orbital ring animation ── */
function OrbitalRing({ radius, duration, delay, color }: {
  radius: number; duration: number; delay: number; color: string
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full border"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        borderColor: color,
        borderStyle: 'dashed',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    />
  )
}

export default function LoadingAnimation() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden flex flex-col items-center justify-center gap-8 rounded-2xl border border-[#222] bg-[#0D0D0D] px-6 py-14"
      style={{ boxShadow: '0 0 60px rgba(255,121,0,0.06), 0 8px 40px rgba(0,0,0,0.5)' }}
    >
      {/* Background pulse */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, #FF7900, transparent)' }}
      />

      {/* ── Spinner complex ── */}
      <div className="relative h-24 w-24">
        {/* Orbital rings */}
        <OrbitalRing radius={46} duration={4}   delay={0}   color="rgba(255,121,0,0.12)" />
        <OrbitalRing radius={36} duration={3}   delay={0.3} color="rgba(255,121,0,0.20)" />
        <OrbitalRing radius={24} duration={1.8} delay={0}   color="rgba(255,121,0,0.35)" />

        {/* Core spinner arc */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,121,0,0.8) 70%, transparent 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner white ring */}
        <div className="absolute inset-[6px] rounded-full bg-[#0D0D0D]" />

        {/* Emoji center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl select-none"
            >
              {messages[index].emoji}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Message ── */}
      <div className="flex flex-col items-center gap-3 text-center max-w-xs">
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              className="text-sm font-medium text-[#888]"
            >
              {messages[index].text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-40 h-0.5 rounded-full bg-[#1A1A1A] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FF7900] to-[#FF9A3D]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Dot pulse */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-1 w-1 rounded-full bg-[#FF7900]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
