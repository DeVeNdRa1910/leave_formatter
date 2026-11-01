import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  emoji: string
}

interface Props {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  hasError?: boolean
}

export default function CustomSelect({ value, options, onChange, hasError }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value) ?? options[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm text-white outline-none transition-all duration-200 bg-[#0D0D0D] text-left ${
          open
            ? 'border-[#FF7900] ring-2 ring-[#FF7900]/12'
            : hasError
              ? 'border-red-500/40'
              : 'border-[#222] hover:border-[#333]'
        }`}
      >
        <span className="text-base leading-none shrink-0">{selected.emoji}</span>
        <span className="flex-1 truncate">{selected.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-[#444]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-[#222] bg-[#111]"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#FF7900]/10 text-[#FF7900]'
                      : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  <span className="text-base leading-none shrink-0">{opt.emoji}</span>
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isSelected && <Check size={13} className="text-[#FF7900] shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
