import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const funnyLines = [
  { text: "No managers were harmed in the making of this email.", emoji: "😇" },
  { text: "Your excuse is 100% AI-certified professional.", emoji: "🤵" },
  { text: "Super Human wrote it. You take the credit.", emoji: "😏" },
  { text: "Approved by no manager yet. But soon.", emoji: "🤞" },
  { text: "Emails so good, even we'd approve them.", emoji: "✅" },
  { text: "Your bed is already waiting for you.", emoji: "🛌" },
  { text: "WFH: Working From Home (or Hammock).", emoji: "🏖️" },
]

const floatingChars = ['☕', '🧳', '✈️', '🏝️', '😴', '💤', '🛌', '🎉']

function FloatingChar({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      className="absolute text-lg select-none pointer-events-none"
      style={{ left: `${10 + index * 11}%`, bottom: '100%' }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -60, -120],
        opacity: [0, 0.6, 0],
        x: [0, (index % 2 === 0 ? 12 : -12), 0],
        rotate: [0, index % 2 === 0 ? 20 : -20, 0],
      }}
      transition={{
        duration: 3,
        delay: index * 0.3,
        repeat: Infinity,
        repeatDelay: floatingChars.length * 0.3 + 1,
        ease: 'easeOut',
      }}
    >
      {char}
    </motion.span>
  )
}

export default function Footer() {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setLineIndex(i => (i + 1) % funnyLines.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="relative mt-24 border-t border-[#111] py-12 text-center overflow-hidden"
    >
      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(255,121,0,0.03) 0%, transparent 70%)' }}
      />

      {/* Floating emojis */}
      <div className="absolute inset-x-0 bottom-full h-32 pointer-events-none">
        {floatingChars.map((c, i) => (
          <FloatingChar key={i} char={c} index={i} />
        ))}
      </div>

      {/* Animated TW logo */}
      <motion.div
        className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF7900] to-[#FF5500]"
        animate={{ rotate: [0, -4, 4, -2, 2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        style={{ boxShadow: '0 0 16px rgba(255,121,0,0.3)' }}
      >
        <span className="text-[11px] font-black text-black">TW</span>
      </motion.div>

      {/* Made with love */}
      <p className="text-sm text-[#3A3A3A] font-medium">
        Made with{' '}
        <motion.span
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block text-red-500/60"
        >
          ❤️
        </motion.span>{' '}
        for Thoughtwin IT Solutions employees
      </p>

      {/* Rotating funny line */}
      <div className="mt-4 h-7 flex items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs text-[#333] flex items-center gap-2"
          >
            <motion.span
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              {funnyLines[lineIndex].emoji}
            </motion.span>
            {funnyLines[lineIndex].text}
            <motion.span
              animate={{ rotate: [0, -15, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
            >
              {funnyLines[lineIndex].emoji}
            </motion.span>
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.footer>
  )
}
