import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram, FaRobot, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  fetchSubscriptionStatus,
  selectTelegramSub,
  selectSubLoading,
} from '@store/slices/subscriptionSlice'
import { subscriptionApi } from '@api/subscriptionApi'
import { SOCIAL_LINKS } from '@utils/constants'
import { useLang } from '@context/LangContext'

const MAX_POLL_ATTEMPTS = 60 // 60 * 3s = 3 daqiqa
const POLL_INTERVAL = 3000

interface TelegramVerifyProps {
  onTelegramVerified?: () => void
}

export default function TelegramVerify({ onTelegramVerified }: TelegramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const telegram = useSelector(selectTelegramSub)
  const loading = useSelector(selectSubLoading)
  const { t } = useLang()

  const [isAutoChecking, setIsAutoChecking] = useState(false)
  const [verifyData, setVerifyData] = useState<{ token: string; botUsername: string } | null>(null)
  const [status, setStatus] = useState<{ linked: boolean; subscribed: boolean }>({ linked: false, subscribed: false })
  const [pollCount, setPollCount] = useState(0)
  const [pollError, setPollError] = useState<string | null>(null)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCountRef = useRef(0)
  const mountedRef = useRef(true)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  // Token yaratish va botni ochish
  const startAutoVerify = async () => {
    if (isAutoChecking) return // Allaqachon tekshirilmoqda — ikkinchi marta bosishni oldini olish
    try {
      setPollError(null)
      setIsAutoChecking(true)
      pollCountRef.current = 0
      setPollCount(0)

      const res = await subscriptionApi.generateToken()
      if (res.data.success) {
        setVerifyData(res.data.data)
        // Botni ochish
        const botUrl = `https://t.me/${res.data.data.botUsername}?start=${res.data.data.token}`
        window.open(botUrl, '_blank')

        // Pollingni boshlash
        startPolling()
      }
    } catch (err) {
      toast.error(t('tg.tokenError'))
      setIsAutoChecking(false)
    }
  }

  const startPolling = () => {
    stopPolling()

    pollingRef.current = setInterval(async () => {
      if (!mountedRef.current) {
        stopPolling()
        return
      }

      pollCountRef.current += 1
      setPollCount(pollCountRef.current)

      // Maksimal urinishlar soni
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        stopPolling()
        setIsAutoChecking(false)
        setPollError(t('tg.timeout'))
        toast.error(t('tg.timeout'))
        return
      }

      try {
        const res = await subscriptionApi.checkToken()
        if (res.data.success) {
          const { linked, subscribed } = res.data.data
          setStatus({ linked, subscribed })

          if (linked && subscribed) {
            stopPolling()
            setIsAutoChecking(false)
            toast.success(t('tg.success'))
            // Redux stateni yangilash
            await dispatch(fetchSubscriptionStatus() as any)
            if (onTelegramVerified) onTelegramVerified()
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, POLL_INTERVAL)
  }

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopPolling()
    }
  }, [stopPolling])

  // Qayta urinish
  const handleRetry = () => {
    setPollError(null)
    setStatus({ linked: false, subscribed: false })
    setVerifyData(null)
    startAutoVerify()
  }

  if (telegram?.subscribed || status.subscribed) {
    return (
      <div className="glass-card border border-emerald-500/30 p-8 rounded-2xl bg-emerald-500/5 text-center space-y-4">
        <IoCheckmarkCircle className="text-6xl text-emerald-500 mx-auto" />
        <div>
          <h3 className="text-xl font-bold text-white">{t('tg.verified')}</h3>
          <p className="text-zinc-400 mt-2">{t('tg.verifiedDesc')}</p>
        </div>
        <button
          onClick={onTelegramVerified}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20"
        >
          {t('tg.continue')}
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6 bg-[#1a1c26] border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

      <div className="text-center space-y-3 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/20 rotate-3">
          <FaTelegram className="text-4xl text-white -rotate-3" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">{t('tg.title')}</h3>
        <p className="text-sm text-zinc-400 max-w-xs mx-auto">{t('tg.subtitle')}</p>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Step 1: Subscribe */}
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0 border border-blue-500/20">1</div>
          <div className="flex-1">
            <p className="text-sm text-zinc-200 font-bold">{t('tg.step1')}</p>
            <p className="text-xs text-zinc-500">{t('tg.step1Sub')}</p>
          </div>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-lg hover:bg-blue-400 transition-all"
          >
            {t('tg.subscribe')}
          </a>
        </div>

        {/* Step 2: Auto Link */}
        <div className={`p-5 border-2 rounded-2xl transition-all ${
          status.linked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/5 border-blue-500/20'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              status.linked ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
            }`}>
              {status.linked ? <FaCheckCircle /> : '2'}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${status.linked ? 'text-emerald-400' : 'text-zinc-200'}`}>
                {status.linked ? t('tg.linked') : t('tg.unlinked')}
              </p>
              {!status.linked ? (
                <button
                  onClick={pollError ? handleRetry : startAutoVerify}
                  disabled={isAutoChecking}
                  className="mt-3 w-full py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAutoChecking ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                  {pollError ? t('tg.retry') : t('tg.linkBot')}
                </button>
              ) : (
                <p className="text-xs text-emerald-500/70 mt-1 font-medium italic">{t('tg.linkedId')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator while waiting */}
        {isAutoChecking && !status.subscribed && (
          <div className="flex items-center justify-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <FaSpinner className="animate-spin text-blue-400" />
            <div className="text-center">
              <p className="text-xs text-zinc-400 font-medium">
                {status.linked ? t('tg.checkingChannel') : t('tg.waitingBot')}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1">
                {Math.max(0, Math.floor((MAX_POLL_ATTEMPTS - pollCount) * POLL_INTERVAL / 1000))} {t('tg.timeLeft')}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {pollError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <IoCloseCircle className="text-red-400 text-lg shrink-0" />
            <p className="text-xs text-red-400 font-medium">{pollError}</p>
          </div>
        )}

        <div className="flex items-center gap-2 px-2 text-[10px] text-zinc-500">
          <IoInformationCircle className="text-sm shrink-0" />
          <p>{t('tg.hint').split('<b>').join('').split('</b>').join('')}</p>
        </div>
      </div>
    </div>
  )
}
