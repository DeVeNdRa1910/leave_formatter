import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Rotating funny subtitles ── */
const rotatingMessages = [
  { text: "Monday again? We understand.", emoji: "☕" },
  { text: "Your bed called. It misses you.", emoji: "🛌" },
  { text: "Even your laptop needs a vacation.", emoji: "💻" },
  { text: "Relax! Super Human handles the corporate English.", emoji: "🤵" },
  { text: "Your manager won't know what hit them.", emoji: "😏" },
]

/* ── Animated coffee SVG with steam ── */
function CoffeeCup() {
  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Steam lines */}
      <div className="flex gap-2 mb-1 h-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-0.5 rounded-full bg-gradient-to-t from-[#FF7900]/60 to-transparent"
            style={{ height: 28 }}
            animate={{
              y: [0, -10, -20],
              opacity: [0.8, 0.5, 0],
              scaleX: [1, 1.4, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.35,
            }}
          />
        ))}
      </div>

      {/* Cup */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, -3, 3, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl select-none"
        style={{ filter: 'drop-shadow(0 0 16px rgba(255,121,0,0.4))' }}
      >
        ☕
      </motion.div>
    </div>
  )
}

/* ── Tiny airplane flying across ── */
function FlyingAirplane() {
  return (
    <motion.div
      className="fixed top-20 z-40 pointer-events-none select-none text-2xl"
      initial={{ x: '-10vw', opacity: 0 }}
      animate={{
        x: ['−10vw', '110vw'],
        opacity: [0, 1, 1, 0],
        y: [0, -20, 20, -10],
      }}
      transition={{
        duration: 6,
        delay: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 18,
      }}
      style={{ left: 0 }}
    >
      ✈️
    </motion.div>
  )
}

/* ── Floating office emojis ── */
const floatingEmojis = [
  { emoji: '📝', x: '8%', y: '30%', delay: 0.5, duration: 4 },
  { emoji: '🗓️', x: '88%', y: '25%', delay: 1.2, duration: 5 },
  { emoji: '💼', x: '5%', y: '65%', delay: 2, duration: 3.5 },
  { emoji: '🏝️', x: '92%', y: '60%', delay: 0.8, duration: 4.5 },
  { emoji: '😴', x: '15%', y: '80%', delay: 1.5, duration: 3.8 },
  { emoji: '🌴', x: '82%', y: '78%', delay: 0.3, duration: 5.2 },
]

function FloatingEmoji({ emoji, x, y, delay, duration }: { emoji: string; x: string; y: string; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute text-lg pointer-events-none select-none hidden lg:block"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -14, 0],
        rotate: [-5, 5, -5],
        opacity: [0.25, 0.5, 0.25],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {emoji}
    </motion.div>
  )
}

/* ── Particles ── */
const particles = [
  { x: '12%', y: '18%', delay: 0, size: 3 },
  { x: '22%', y: '62%', delay: 0.7, size: 5 },
  { x: '38%', y: '28%', delay: 1.2, size: 2 },
  { x: '55%', y: '72%', delay: 1.8, size: 4 },
  { x: '68%', y: '18%', delay: 0.9, size: 3 },
  { x: '78%', y: '52%', delay: 0.4, size: 5 },
  { x: '87%', y: '32%', delay: 1.4, size: 2 },
  { x: '93%', y: '68%', delay: 0.6, size: 4 },
  { x: '3%',  y: '78%', delay: 2,   size: 3 },
  { x: '45%', y: '48%', delay: 2.3, size: 2 },
  { x: '30%', y: '85%', delay: 0.2, size: 4 },
  { x: '72%', y: '85%', delay: 1.6, size: 3 },
]

function Particle({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#FF7900] pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, filter: 'blur(0.5px)' }}
      animate={{ y: [0, -18, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

/* ── Main Component ── */
export default function HeroSection() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % rotatingMessages.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative overflow-hidden pt-28 pb-16 text-center">
      {/* Deep radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,121,0,0.07) 0%, transparent 65%)',
            'radial-gradient(ellipse 40% 30% at 50% 100%, rgba(255,121,0,0.04) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,121,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,121,0,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map((e, i) => <FloatingEmoji key={i} {...e} />)}
      </div>

      {/* Flying airplane */}
      <FlyingAirplane />

      {/* ── Content ── */}

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF7900]/25 bg-gradient-to-r from-[#FF7900]/12 to-[#FF9A3D]/8 px-5 py-2 text-sm font-medium text-[#FF9A3D] backdrop-blur-sm"
        style={{ boxShadow: '0 0 20px rgba(255,121,0,0.1)' }}
      >
        <motion.span
          animate={{ rotate: [0, 20, -10, 0] }}
          transition={{ delay: 1.5, duration: 0.7, repeat: Infinity, repeatDelay: 5 }}
          className="text-base"
        >
          😎
        </motion.span>
        Need a Break? Let AI Handle the Excuses!
        <motion.span
          className="ml-0.5 text-[10px] font-bold text-[#FF7900]/60 uppercase tracking-widest"
        >
          Beta
        </motion.span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
      >
        Your Leave.{' '}
        <span className="text-gradient-orange">Your Rules.</span>
        <br className="hidden sm:block" />
        {' '}Your Email. 🚀
      </motion.h1>

      {/* Rotating funny subtitle */}
      <div className="mt-6 h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-base text-[#666] sm:text-lg"
          >
            {rotatingMessages[msgIndex].text}{' '}
            <span className="inline-block">{rotatingMessages[msgIndex].emoji}</span>
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Static description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mx-auto mt-3 max-w-lg px-4 text-sm text-[#444]"
      >
        Generate professional leave and WFH request emails in seconds.
        <br />Powered by Super Human AI via Azure AI Foundry.
      </motion.p>

      {/* Coffee cup with steam */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <CoffeeCup />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 flex flex-col items-center gap-1.5"
      >
        <span className="text-xs text-[#333] tracking-widest uppercase font-medium">Pick your escape</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[#333] text-lg"
        >
          ↓
        </motion.div>
      </motion.div>
    </div>
  )
}
