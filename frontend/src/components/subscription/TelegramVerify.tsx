import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram, FaRobot, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoCopyOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { fetchSubscriptionStatus, selectTelegramSub } from '@store/slices/subscriptionSlice'
import { subscriptionApi } from '@api/subscriptionApi'
import { SOCIAL_LINKS } from '@utils/constants'
import { useLang } from '@/context/LangContext'

/** ~3 daqiqa atrofida: interval qadamba-qadam oshadi (Telegram rate limit va batareya uchun). */
const MAX_POLL_ATTEMPTS = 52

interface TelegramVerifyProps {
  onTelegramVerified?: () => void
}

type PollPayload = {
  linked: boolean
  subscribed: boolean
  telegramApiChecked?: boolean
}

function stripHtmlTags(s: string) {
  return s.replace(/<[^>]+>/g, '')
}

export default function TelegramVerify({ onTelegramVerified }: TelegramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const telegram = useSelector(selectTelegramSub)
  const { t } = useLang()

  const [isAutoChecking, setIsAutoChecking] = useState(false)
  const [verifyData, setVerifyData] = useState<{ token: string; botUsername: string } | null>(null)
  const [status, setStatus] = useState<PollPayload>({ linked: false, subscribed: false })
  const [pollCount, setPollCount] = useState(0)
  const [pollError, setPollError] = useState<string | null>(null)
  const [lastApiChecked, setLastApiChecked] = useState<boolean | null>(null)
  const [showNetworkHint, setShowNetworkHint] = useState(false)

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollCountRef = useRef(0)
  const mountedRef = useRef(true)
  const isAutoCheckingRef = useRef(false)

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current != null) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  const computeDelayMs = useCallback((attempt: number) => {
    const hidden = typeof document !== 'undefined' && document.hidden
    if (hidden) return 10_000
    const base = Math.min(6500, 2000 + attempt * 140)
    const jitter = Math.random() * 450
    return Math.round(base + jitter)
  }, [])

  const runPoll = useCallback(async () => {
    if (!mountedRef.current || !isAutoCheckingRef.current) return

    pollCountRef.current += 1
    setPollCount(pollCountRef.current)

    if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
      clearPollTimer()
      isAutoCheckingRef.current = false
      setIsAutoChecking(false)
      setPollError(t('tg.timeout'))
      toast.error(t('tg.timeout'))
      return
    }

    try {
      const res = await subscriptionApi.checkToken()
      if (!res.data.success) return

      const { linked, subscribed, telegramApiChecked } = res.data.data as PollPayload
      setStatus({ linked, subscribed, telegramApiChecked })
      if (typeof telegramApiChecked === 'boolean') {
        setLastApiChecked(telegramApiChecked)
        if (!telegramApiChecked && pollCountRef.current > 6) setShowNetworkHint(true)
      }

      if (linked && subscribed) {
        clearPollTimer()
        isAutoCheckingRef.current = false
        setIsAutoChecking(false)
        toast.success(t('tg.success'))
        await dispatch(fetchSubscriptionStatus() as any)
        onTelegramVerified?.()
        return
      }
    } catch {
      // tarmoq xatosi — keyingi urinishda davom etamiz
    }

    pollTimerRef.current = setTimeout(() => {
      void runPoll()
    }, computeDelayMs(pollCountRef.current))
  }, [clearPollTimer, computeDelayMs, dispatch, onTelegramVerified, t])

  const startPolling = useCallback(() => {
    clearPollTimer()
    isAutoCheckingRef.current = true
    pollTimerRef.current = setTimeout(() => {
      void runPoll()
    }, 1800)
  }, [clearPollTimer, runPoll])

  const startAutoVerify = async () => {
    if (isAutoCheckingRef.current) return
    try {
      setPollError(null)
      setShowNetworkHint(false)
      setLastApiChecked(null)
      setIsAutoChecking(true)
      isAutoCheckingRef.current = true
      pollCountRef.current = 0
      setPollCount(0)

      const res = await subscriptionApi.generateToken()
      if (res.data.success) {
        setVerifyData(res.data.data)
        const botUrl = `https://t.me/${res.data.data.botUsername}?start=${res.data.data.token}`
        window.open(botUrl, '_blank', 'noopener,noreferrer')
        startPolling()
      } else {
        setIsAutoChecking(false)
        isAutoCheckingRef.current = false
        toast.error(t('tg.tokenError'))
      }
    } catch {
      toast.error(t('tg.tokenError'))
      setIsAutoChecking(false)
      isAutoCheckingRef.current = false
    }
  }

  const handleRetry = () => {
    setPollError(null)
    setStatus({ linked: false, subscribed: false })
    setVerifyData(null)
    setShowNetworkHint(false)
    setLastApiChecked(null)
    clearPollTimer()
    void startAutoVerify()
  }

  const copyDeepLink = async () => {
    if (!verifyData) return
    const url = `https://t.me/${verifyData.botUsername}?start=${verifyData.token}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('tg.linkCopied'))
    } catch {
      toast.error(t('tg.tokenError'))
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      isAutoCheckingRef.current = false
      clearPollTimer()
    }
  }, [clearPollTimer])

  const approxSecondsLeft = Math.max(
    0,
    Math.floor(((MAX_POLL_ATTEMPTS - pollCount) * 3.2 * 1000) / 1000),
  )

  if (telegram?.subscribed || status.subscribed) {
    return (
      <div className="glass-card border border-emerald-500/30 p-8 rounded-2xl bg-emerald-500/5 text-center space-y-4">
        <IoCheckmarkCircle className="text-6xl text-emerald-500 mx-auto" aria-hidden />
        <div>
          <h3 className="text-xl font-bold text-white">{t('tg.verified')}</h3>
          <p className="text-zinc-400 mt-2">{t('tg.verifiedDesc')}</p>
        </div>
        {onTelegramVerified && (
          <button
            type="button"
            onClick={onTelegramVerified}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20"
          >
            {t('tg.continue')}
          </button>
        )}
      </div>
    )
  }

  const showSubscribeReminder =
    status.linked && !status.subscribed && pollCount > 5 && lastApiChecked === true

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6 bg-[#1a1c26] border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16" aria-hidden />

      <div className="text-center space-y-3 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/20 rotate-3">
          <FaTelegram className="text-4xl text-white -rotate-3" aria-hidden />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">{t('tg.title')}</h3>
        <p className="text-sm text-zinc-400 max-w-xs mx-auto">{t('tg.subtitle')}</p>
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isAutoChecking
          ? `${status.linked ? t('tg.checkingChannel') : t('tg.waitingBot')} ${approxSecondsLeft} ${t('tg.timeLeft')}`
          : ''}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0 border border-blue-500/20">
            1
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 font-bold">{t('tg.step1')}</p>
            <p className="text-xs text-zinc-500">{t('tg.step1Sub')}</p>
          </div>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-lg hover:bg-blue-400 transition-all shrink-0"
          >
            {t('tg.subscribe')}
          </a>
        </div>

        <div
          className={`p-5 border-2 rounded-2xl transition-all ${
            status.linked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/5 border-blue-500/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                status.linked ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
              }`}
            >
              {status.linked ? <FaCheckCircle aria-hidden /> : '2'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${status.linked ? 'text-emerald-400' : 'text-zinc-200'}`}>
                {status.linked ? t('tg.linked') : t('tg.unlinked')}
              </p>
              {!status.linked ? (
                <button
                  type="button"
                  onClick={pollError ? handleRetry : startAutoVerify}
                  disabled={isAutoChecking}
                  className="mt-3 w-full py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAutoChecking ? <FaSpinner className="animate-spin" aria-hidden /> : <FaRobot aria-hidden />}
                  {pollError ? t('tg.retry') : t('tg.linkBot')}
                </button>
              ) : (
                <p className="text-xs text-emerald-500/70 mt-1 font-medium italic">{t('tg.linkedId')}</p>
              )}

              {verifyData && (
                <button
                  type="button"
                  onClick={() => void copyDeepLink()}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] font-semibold text-zinc-300 hover:bg-white/5"
                >
                  <IoCopyOutline className="text-base" aria-hidden />
                  {t('tg.copyLink')}
                </button>
              )}
            </div>
          </div>
        </div>

        {isAutoChecking && !status.subscribed && (
          <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <div className="flex items-center justify-center gap-3">
              <FaSpinner className="animate-spin text-blue-400 shrink-0" aria-hidden />
              <div className="text-center min-w-0">
                <p className="text-xs text-zinc-400 font-medium">
                  {status.linked ? t('tg.checkingChannel') : t('tg.waitingBot')}
                </p>
                <p className="text-[10px] text-zinc-600 mt-1">
                  ~{approxSecondsLeft} {t('tg.timeLeft')}
                </p>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800" aria-hidden>
              <div
                className="h-full rounded-full bg-blue-500/70 transition-all duration-500"
                style={{ width: `${Math.min(100, (pollCount / MAX_POLL_ATTEMPTS) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {showSubscribeReminder && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-100/90">
            <IoInformationCircle className="mt-0.5 shrink-0 text-lg text-amber-400" aria-hidden />
            <p>{t('tg.subscribeChannelHint')}</p>
          </div>
        )}

        {showNetworkHint && isAutoChecking && (
          <div className="flex items-start gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-100/90">
            <IoInformationCircle className="mt-0.5 shrink-0 text-lg text-sky-400" aria-hidden />
            <p>{t('tg.networkDelay')}</p>
          </div>
        )}

        {pollError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <IoCloseCircle className="text-red-400 text-lg shrink-0" aria-hidden />
            <p className="text-xs text-red-400 font-medium">{pollError}</p>
          </div>
        )}

        <p className="flex items-start gap-2 px-1 text-[10px] leading-relaxed text-zinc-500">
          <IoInformationCircle className="text-sm shrink-0 mt-0.5" aria-hidden />
          <span>{stripHtmlTags(t('tg.hint'))}</span>
        </p>
        <p className="px-1 text-[10px] leading-relaxed text-zinc-600 border-t border-white/5 pt-3">
          {t('tg.privacyShort')}
        </p>
      </div>
    </div>
  )
}
