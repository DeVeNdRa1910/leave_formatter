import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Laptop } from 'lucide-react'
import type { RequestType } from '../types/leave'

interface Props {
  selected: RequestType | null
  onSelect: (type: RequestType) => void
}

/* ── Suitcase character for Leave card ── */
function SuitcaseCharacter({ isHovered, isSelected }: { isHovered: boolean; isSelected: boolean }) {
  return (
    <motion.div
      animate={
        isHovered
          ? { rotate: [-4, 4, -4, 4, -2, 2, 0], y: [0, -4, 0] }
          : isSelected
          ? { y: [0, -4, 0] }
          : {}
      }
      transition={
        isHovered
          ? { duration: 0.6, ease: 'easeInOut' }
          : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
      }
      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-colors duration-300 ${
        isSelected ? 'bg-[#FF7900]/20' : 'bg-[#1E1E1E]'
      }`}
      style={isSelected ? { boxShadow: '0 0 20px rgba(255,121,0,0.15)' } : {}}
    >
      🧳
    </motion.div>
  )
}

/* ── Laptop character with blinking eyes for WFH card ── */
function LaptopCharacter({ isSelected }: { isSelected: boolean }) {
  return (
    <motion.div
      animate={isSelected ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`mb-4 relative flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-colors duration-300 ${
        isSelected ? 'bg-[#FF7900]/20' : 'bg-[#1E1E1E]'
      }`}
      style={isSelected ? { boxShadow: '0 0 20px rgba(255,121,0,0.15)' } : {}}
    >
      💻
      {/* Blinking eyes overlay */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
        <motion.div
          className="h-1 w-1 rounded-full bg-[#FF7900]"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
          style={{ originY: 'center' }}
        />
        <motion.div
          className="h-1 w-1 rounded-full bg-[#FF7900]"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1], delay: 0.06 }}
          style={{ originY: 'center' }}
        />
      </div>
    </motion.div>
  )
}

const cards = [
  {
    type: 'leave' as RequestType,
    FallbackIcon: CalendarDays,
    title: 'Apply for Leave',
    description: 'Generate a professional leave request email for any occasion.',
    selectedEmoji: '🏖️',
    selectedMessage: 'BRB, recharging my human battery.',
    tag: 'LEAVE',
  },
  {
    type: 'wfh' as RequestType,
    FallbackIcon: Laptop,
    title: 'Request Work From Home',
    description: 'Write a polished WFH request email that managers love.',
    selectedEmoji: '☕',
    selectedMessage: 'Same deadlines, better coffee.',
    tag: 'WFH',
  },
]

export default function LeaveTypeSelector({ selected, onSelect }: Props) {
  const [hoveredType, setHoveredType] = useState<RequestType | null>(null)

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-xl font-bold text-white tracking-tight">
          What's your escape plan?
        </h2>
        <p className="mt-1.5 text-sm text-[#555]">
          Pick one. We won't judge. 😌
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, index) => {
          const isSelected = selected === card.type
          const isHovered = hoveredType === card.type

          return (
            <motion.button
              key={card.type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(card.type)}
              onHoverStart={() => setHoveredType(card.type)}
              onHoverEnd={() => setHoveredType(null)}
              className={`relative w-full rounded-2xl border p-6 text-left transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'border-[#FF7900]/60 bg-[#191919] card-glow-active'
                  : 'border-[#222] bg-[#111] card-glow hover:border-[#FF7900]/30 card-glow-hover'
              }`}
            >
              {/* Background gradient on hover/select */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: isSelected ? 1 : isHovered ? 0.6 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(255,121,0,0.07) 0%, transparent 70%)',
                }}
              />

              {/* Tag badge */}
              <div className="absolute top-4 right-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.4 }}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#FF7900]/15 border-[#FF7900]/40 text-[#FF9A3D]'
                      : 'bg-[#1E1E1E] border-[#333] text-[#555]'
                  }`}
                >
                  {card.tag}
                </motion.div>
              </div>

              <div className="relative">
                {/* Icon character */}
                {card.type === 'leave' ? (
                  <SuitcaseCharacter isHovered={isHovered} isSelected={isSelected} />
                ) : (
                  <LaptopCharacter isSelected={isSelected} />
                )}

                {/* Title */}
                <h3 className={`text-base font-semibold tracking-tight transition-colors duration-200 ${
                  isSelected ? 'text-white' : 'text-[#C0C0C0]'
                }`}>
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-sm text-[#555] leading-relaxed">
                  {card.description}
                </p>

                {/* Selected message pill */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#FF7900]/20 bg-[#FF7900]/8 px-3.5 py-2.5">
                        <motion.span
                          animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
                          className="text-xl leading-none shrink-0"
                        >
                          {card.selectedEmoji}
                        </motion.span>
                        <span className="text-sm font-medium text-[#FF9A3D]">
                          {card.selectedMessage}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom orange bar on select */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7900] to-transparent"
                animate={{ opacity: isSelected ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
