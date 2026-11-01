import { useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LeaveTypeSelector from './components/LeaveTypeSelector'
import LeaveForm from './components/LeaveForm'
import WFHForm from './components/WFHForm'
import EmailPreview from './components/EmailPreview'
import LoadingAnimation from './components/LoadingAnimation'
import ToastContainer from './components/Toast'
import Footer from './components/Footer'
import { generateEmail } from './services/aiService'
import type {
  RequestType,
  LeaveFormData,
  WFHFormData,
  GenerateEmailResponse,
  Toast,
} from './types/leave'

let toastCounter = 0

export default function App() {
  const [selectedType, setSelectedType] = useState<RequestType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState<GenerateEmailResponse | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [lastRequest, setLastRequest] = useState<Parameters<typeof generateEmail>[0] | null>(null)

  const emailRef = useRef<HTMLDivElement>(null)

  function addToast(message: string, type: Toast['type'] = 'info') {
    const id = String(++toastCounter)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => dismissToast(id), 4000)
  }

  function dismissToast(id: string) {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }

  function handleTypeSelect(type: RequestType) {
    setSelectedType(type)
    setEmail(null)
  }

  async function handleLeaveSubmit(data: LeaveFormData) {
    const request = {
      request_type: 'leave' as RequestType,
      date_from: data.dateFrom,
      date_to: data.dateTo,
      reason: data.reason,
      leave_type: data.leaveType,
      project_name: data.projectName,
      name: data.name,
      salutation: data.salutation,
    }
    await doGenerate(request)
  }

  async function handleWFHSubmit(data: WFHFormData) {
    const request = {
      request_type: 'wfh' as RequestType,
      date_from: data.dateFrom,
      date_to: data.dateTo,
      reason: data.reason,
      project_name: data.projectName,
      additional_notes: data.additionalNotes,
      name: data.name,
      salutation: data.salutation,
    }
    await doGenerate(request)
  }

  const doGenerate = useCallback(async (request: Parameters<typeof generateEmail>[0]) => {
    setIsLoading(true)
    setEmail(null)
    setLastRequest(request)
    try {
      const result = await generateEmail(request)
      setEmail(result)
      setTimeout(() => {
        emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      addToast(msg, 'error')
    } finally {
      setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRegenerate() {
    if (!lastRequest) return
    await doGenerate(lastRequest)
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      addToast('Copied! Your manager is one click away. 😎', 'success')
    }).catch(() => {
      addToast('Failed to copy. Please copy manually.', 'error')
    })
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      <main className="mx-auto max-w-3xl">
        <HeroSection />

        <div className="px-4 pb-4 space-y-10">
          {/* Leave type cards */}
          <LeaveTypeSelector selected={selectedType} onSelect={handleTypeSelect} />

          {/* Forms */}
          <AnimatePresence mode="wait">
            {selectedType === 'leave' && (
              <motion.div
                key="leave-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <LeaveForm onSubmit={handleLeaveSubmit} isLoading={isLoading} />
              </motion.div>
            )}

            {selectedType === 'wfh' && (
              <motion.div
                key="wfh-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <WFHForm onSubmit={handleWFHSubmit} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading / Email Preview */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <LoadingAnimation />
              </motion.div>
            )}

            {!isLoading && email && (
              <motion.div
                key="email-preview"
                ref={emailRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Divider */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#222] to-transparent" />
                  <span className="text-xs text-[#444] font-medium tracking-widest uppercase">Generated Email</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#222] to-transparent" />
                </div>

                <EmailPreview
                  email={email}
                  onRegenerate={handleRegenerate}
                  onCopy={handleCopy}
                  isRegenerating={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
