import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, RotateCcw, Edit3, Check, Mail, Sparkles, Eye } from 'lucide-react'
import type { GenerateEmailResponse } from '../types/leave'

interface Props {
  email: GenerateEmailResponse
  onRegenerate: () => void
  onCopy: (text: string) => void
  isRegenerating: boolean
}

/* ── Confetti burst on copy ── */
function ConfettiBurst({ active }: { active: boolean }) {
  const colors = ['#FF7900', '#FF9A3D', '#FFB86C', '#ffffff', '#FF5500']
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: colors[i % colors.length],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.cos((i / 16) * Math.PI * 2) * 60) + (Math.random() * 30 - 15),
                y: (Math.sin((i / 16) * Math.PI * 2) * 60) + (Math.random() * 30 - 15),
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

export default function EmailPreview({ email, onRegenerate, onCopy, isRegenerating }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(email.email_body)
  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState(false)

  function handleCopy() {
    onCopy(editBody)
    setCopied(true)
    setBurst(true)
    setTimeout(() => setCopied(false), 3000)
    setTimeout(() => setBurst(false), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[#FF7900]/30 bg-[#0D0D0D]"
      style={{ boxShadow: '0 0 0 1px rgba(255,121,0,0.15), 0 0 80px rgba(255,121,0,0.08), 0 16px 60px rgba(0,0,0,0.6)' }}
    >
      {/* Top orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7900]/70 to-transparent" />

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#1A1A1A] bg-[#111] px-5 py-4">
        {/* Status badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
          className="flex items-center gap-2 rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10 px-3.5 py-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF7900]/20"
          >
            <Sparkles size={12} className="text-[#FF7900]" />
          </motion.div>
          <div>
            <p className="text-xs font-bold text-[#FF9A3D] leading-tight">Boom! Your email is ready. 🚀</p>
            <p className="text-[10px] text-[#555] leading-tight">AI-generated · Review before sending</p>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit / Preview toggle */}
          <motion.button
            onClick={() => setIsEditing((e) => !e)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isEditing
                ? 'border-[#FF7900]/50 bg-[#FF7900]/12 text-[#FF9A3D]'
                : 'border-[#222] bg-[#191919] text-[#666] hover:border-[#333] hover:text-white'
            }`}
          >
            {isEditing ? <Eye size={11} /> : <Edit3 size={11} />}
            {isEditing ? 'Preview' : 'Edit'}
          </motion.button>

          {/* Regenerate */}
          <motion.button
            onClick={onRegenerate}
            disabled={isRegenerating}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 rounded-lg border border-[#222] bg-[#191919] px-3 py-1.5 text-xs font-semibold text-[#666] transition-all duration-200 hover:border-[#333] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <motion.span
              animate={isRegenerating ? { rotate: 360 } : {}}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            >
              <RotateCcw size={11} />
            </motion.span>
            Regenerate
          </motion.button>

          {/* Copy */}
          <div className="relative">
            <ConfettiBurst active={burst} />
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
                copied
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'text-black'
              }`}
              style={
                copied
                  ? {}
                  : {
                      background: 'linear-gradient(135deg, #FF7900, #FF9A3D)',
                      boxShadow: '0 0 16px rgba(255,121,0,0.4)',
                    }
              }
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={11} />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={11} />
                  </motion.span>
                )}
              </AnimatePresence>
              {copied ? 'Copied!' : 'Copy Email'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Email body ── */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={11} className="text-[#333]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#333]">Email Body</span>
        </div>

        {isEditing ? (
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={14}
            className="w-full rounded-xl border border-[#222] bg-[#141414] px-4 py-3 text-sm text-[#D0D0D0] leading-relaxed outline-none transition-colors focus:border-[#FF7900] focus:ring-2 focus:ring-[#FF7900]/10 resize-none scrollbar-thin"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm text-[#C0C0C0] leading-[1.85] font-[350]">
            {editBody}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-[#161616] bg-[#0A0A0A] px-6 py-3">
        <p className="text-xs text-[#333]">
          💡 Personalize before sending. AI is smart, but you know your manager best.
        </p>
        {/* Word count */}
        <span className="text-[10px] text-[#2A2A2A] shrink-0">
          {editBody.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </motion.div>
  )
}
