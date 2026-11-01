import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Laptop, FileText, Briefcase, MessageSquare, ArrowRight, RotateCcw, CalendarDays, User } from 'lucide-react'
import type { WFHFormData, Salutation, ValidationErrors } from '../types/leave'
import { validateWFHForm, hasErrors, getTodayString } from '../utils/validation'
import CustomSelect, { type SelectOption } from './CustomSelect'

interface Props {
  onSubmit: (data: WFHFormData) => void
  isLoading: boolean
}

const salutationOptions: SelectOption[] = [
  { value: 'Dear Manager', label: 'Dear Manager', emoji: '👔' },
  { value: 'Hello Team',   label: 'Hello Team',   emoji: '👥' },
  { value: "Hello Ma'am",  label: "Hello Ma'am",  emoji: '👩‍💼' },
  { value: 'Hello Sir',    label: 'Hello Sir',    emoji: '👨‍💼' },
]

const empty: WFHFormData = {
  dateFrom: '',
  dateTo: '',
  reason: '',
  projectName: '',
  additionalNotes: '',
  name: '',
  salutation: 'Dear Manager',
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-[#555]">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-red-400 flex items-center gap-1.5"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-red-400 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const base = 'w-full rounded-xl border bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder-[#333]'
const idle = 'border-[#222] focus:border-[#FF7900] focus:ring-2 focus:ring-[#FF7900]/12'
const errCls = 'border-red-500/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'

function inputCls(hasErr?: string) { return `${base} ${hasErr ? errCls : idle}` }

export default function WFHForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<WFHFormData>(empty)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [btnHovered, setBtnHovered] = useState(false)
  const today = getTodayString()

  function update<K extends keyof WFHFormData>(key: K, value: WFHFormData[K]) {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) setErrors(validateWFHForm(next))
  }

  function touch(key: string) {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors(validateWFHForm(form))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]))
    setTouched(allTouched)
    const errs = validateWFHForm(form)
    setErrors(errs)
    if (!hasErrors(errs)) onSubmit(form)
  }

  function handleReset() { setForm(empty); setErrors({}); setTouched({}) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[#222] bg-[#111]"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.5)' }}
    >
      {/* Subtle glow */}
      <div
        className="absolute top-0 left-0 w-64 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(255,121,0,0.06) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-[#1A1A1A] px-4 sm:px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF7900]/12 border border-[#FF7900]/20 shrink-0">
          <Laptop size={15} className="text-[#FF7900]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white tracking-tight">WFH Request Details</h3>
          <p className="text-xs text-[#444] truncate">Same work, zero commute. Super Human's got you. ☕</p>
        </div>

        <motion.button
          type="button"
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#222] px-3 py-1.5 text-xs text-[#444] transition-colors hover:border-[#333] hover:text-[#888] shrink-0"
        >
          <RotateCcw size={11} />
          <span className="hidden xs:inline">Reset</span>
        </motion.button>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="relative p-4 sm:p-6 space-y-4 sm:space-y-5">

        {/* Name + Salutation row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Your Name *" error={errors.name}>
            <div className="relative">
              <User size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                type="text"
                value={form.name}
                placeholder="Your full name"
                onChange={(e) => update('name', e.target.value)}
                onBlur={() => touch('name')}
                className={`${inputCls(errors.name)} pl-9`}
              />
            </div>
          </FormField>

          <FormField label="Open Email With">
            <CustomSelect
              value={form.salutation}
              options={salutationOptions}
              onChange={(v) => update('salutation', v as Salutation)}
            />
          </FormField>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1A1A1A]" />

        {/* Date row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="From Date *" error={errors.dateFrom}>
            <div className="relative">
              <CalendarDays size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                type="date"
                value={form.dateFrom}
                min={today}
                onChange={(e) => update('dateFrom', e.target.value)}
                onBlur={() => touch('dateFrom')}
                className={`${inputCls(errors.dateFrom)} pl-9`}
              />
            </div>
          </FormField>
          <FormField label="To Date *" error={errors.dateTo}>
            <div className="relative">
              <CalendarDays size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                type="date"
                value={form.dateTo}
                min={form.dateFrom || today}
                onChange={(e) => update('dateTo', e.target.value)}
                onBlur={() => touch('dateTo')}
                className={`${inputCls(errors.dateTo)} pl-9`}
              />
            </div>
          </FormField>
        </div>

        {/* Project name */}
        <FormField label="Project Name *" error={errors.projectName}>
          <div className="relative">
            <Briefcase size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              value={form.projectName}
              placeholder="e.g. Customer Portal, AI Development"
              onChange={(e) => update('projectName', e.target.value)}
              onBlur={() => touch('projectName')}
              className={`${inputCls(errors.projectName)} pl-9`}
            />
          </div>
        </FormField>

        {/* Reason */}
        <FormField label="Reason for WFH *" error={errors.reason}>
          <div className="relative">
            <FileText size={14} className="pointer-events-none absolute left-3.5 top-3.5 text-[#444]" />
            <textarea
              value={form.reason}
              placeholder="Why are you working from home? (we'll make it sound very professional)"
              rows={3}
              onChange={(e) => update('reason', e.target.value)}
              onBlur={() => touch('reason')}
              className={`${inputCls(errors.reason)} pl-9 resize-none`}
            />
          </div>
        </FormField>

        {/* Additional notes */}
        <FormField label="Additional Notes (optional)">
          <div className="relative">
            <MessageSquare size={14} className="pointer-events-none absolute left-3.5 top-3.5 text-[#444]" />
            <textarea
              value={form.additionalNotes}
              placeholder="Any extra context, deliverable commitments, etc..."
              rows={2}
              onChange={(e) => update('additionalNotes', e.target.value)}
              className={`${inputCls()} pl-9 resize-none`}
            />
          </div>
        </FormField>

        {/* Generate Button */}
        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={isLoading}
            onHoverStart={() => setBtnHovered(true)}
            onHoverEnd={() => setBtnHovered(false)}
            whileHover={isLoading ? {} : { scale: 1.01, y: -1 }}
            whileTap={isLoading ? {} : { scale: 0.99 }}
            className="relative w-full overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FF7900 0%, #FF9A3D 50%, #FF7900 100%)',
              backgroundSize: '200% 100%',
              boxShadow: isLoading ? 'none' : '0 0 24px rgba(255,121,0,0.45), 0 4px 16px rgba(255,121,0,0.25)',
            }}
          >
            {!isLoading && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ x: btnHovered ? ['−100%', '200%'] : '-100%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{
                  background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
                }}
              />
            )}

            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black"
                  />
                  Generating your email...
                </>
              ) : (
                <>
                  <span>✨ Generate Email</span>
                  <motion.span
                    animate={btnHovered ? { x: [0, 4, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <ArrowRight size={15} />
                  </motion.span>
                </>
              )}
            </span>
          </motion.button>

          {!isLoading && (
            <p className="mt-2.5 text-center text-xs text-[#333]">
              Super Human will craft a professional WFH email your manager will love 🏠
            </p>
          )}
        </div>
      </form>
    </motion.div>
  )
}
