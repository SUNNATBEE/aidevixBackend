'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoAlertCircle,
  IoCopyOutline,
  IoRefresh,
} from 'react-icons/io5'
import toast from 'react-hot-toast'
import { fetchSubscriptionStatus, selectTelegramSub } from '@store/slices/subscriptionSlice'
import { subscriptionApi } from '@api/subscriptionApi'
import { SOCIAL_LINKS } from '@utils/constants'
import { useLang } from '@/context/LangContext'

// ~3 daqiqa: urinish oralig'i asta-sekin oshadi
const MAX_POLL_ATTEMPTS = 52

type Phase = 'start' | 'after_channel' | 'polling' | 'timeout'

type PollPayload = { linked: boolean; subscribed: boolean; telegramApiChecked?: boolean }

export default function TelegramVerify({
  onTelegramVerified,
}: {
  onTelegramVerified?: () => void
}): JSX.Element {
  const dispatch = useDispatch()
  const telegram = useSelector(selectTelegramSub)
  const { t } = useLang()

  const [phase, setPhase] = useState<Phase>('start')
  const [status, setStatus] = useState<PollPayload>({ linked: false, subscribed: false })
  const [pollCount, setPollCount] = useState(0)
  const [botLinkLoading, setBotLinkLoading] = useState(false)
  const [botUrl, setBotUrl] = useState<string | null>(null)
  const [showChannelReminder, setShowChannelReminder] = useState(false)
  const [showNetworkHint, setShowNetworkHint] = useState(false)

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollCountRef = useRef(0)
  const mountedRef = useRef(true)
  const isPollingRef = useRef(false)

  // ─── Polling helpers ────────────────────────────────────────────────
  const clearPoll = useCallback(() => {
    if (pollTimerRef.current) { clearTimeout(pollTimerRef.current); pollTimerRef.current = null }
  }, [])

  const delayMs = useCallback((attempt: number) => {
    if (typeof document !== 'undefined' && document.hidden) return 10_000
    return Math.round(Math.min(6500, 2000 + attempt * 140) + Math.random() * 450)
  }, [])

  const runPoll = useCallback(async () => {
    if (!mountedRef.current || !isPollingRef.current) return
    pollCountRef.current += 1
    setPollCount(pollCountRef.current)

    if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
      clearPoll()
      isPollingRef.current = false
      setPhase('timeout')
      return
    }

    try {
      const res = await subscriptionApi.checkToken()
      if (!res.data.success) throw new Error('no success')
      const payload = res.data.data as PollPayload
      setStatus(payload)

      if (typeof payload.telegramApiChecked === 'boolean') {
        if (!payload.telegramApiChecked && pollCountRef.current > 6) setShowNetworkHint(true)
      }
      if (payload.linked && !payload.subscribed && pollCountRef.current > 5) {
        setShowChannelReminder(true)
      }
      if (payload.linked && payload.subscribed) {
        clearPoll()
        isPollingRef.current = false
        toast.success(t('tg.success'))
        await dispatch(fetchSubscriptionStatus() as any)
        onTelegramVerified?.()
        return
      }
    } catch { /* tarmoq xatosi — davom etamiz */ }

    pollTimerRef.current = setTimeout(() => void runPoll(), delayMs(pollCountRef.current))
  }, [clearPoll, delayMs, dispatch, onTelegramVerified, t])

  const startPolling = useCallback(() => {
    clearPoll()
    isPollingRef.current = true
    pollTimerRef.current = setTimeout(() => void runPoll(), 1800)
  }, [clearPoll, runPoll])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false; isPollingRef.current = false; clearPoll() }
  }, [clearPoll])

  // ─── Handlers ───────────────────────────────────────────────────────
  const handleOpenChannel = () => {
    window.open(SOCIAL_LINKS.telegram, '_blank', 'noopener,noreferrer')
  }

  const handleChannelConfirm = () => {
    setPhase('after_channel')
  }

  const handleConnectBot = async () => {
    if (isPollingRef.current) return
    try {
      setBotLinkLoading(true)
      setShowChannelReminder(false)
      setShowNetworkHint(false)
      pollCountRef.current = 0
      setPollCount(0)
      setStatus({ linked: false, subscribed: false })

      const res = await subscriptionApi.generateToken()
      if (!res.data.success) { toast.error(t('tg.tokenError')); return }

      const url = `https://t.me/${res.data.data.botUsername}?start=${res.data.data.token}`
      setBotUrl(url)
      window.open(url, '_blank', 'noopener,noreferrer')
      setPhase('polling')
      startPolling()
    } catch {
      toast.error(t('tg.tokenError'))
    } finally {
      setBotLinkLoading(false)
    }
  }

  const handleRetry = () => {
    clearPoll()
    isPollingRef.current = false
    setPhase('start')
    setStatus({ linked: false, subscribed: false })
    setBotUrl(null)
    setShowChannelReminder(false)
    setShowNetworkHint(false)
    pollCountRef.current = 0
    setPollCount(0)
  }

  const copyBotLink = async () => {
    if (!botUrl) return
    try { await navigator.clipboard.writeText(botUrl); toast.success(t('tg.linkCopied')) }
    catch { toast.error(t('tg.tokenError')) }
  }

  // ─── Already verified ───────────────────────────────────────────────
  if (telegram?.subscribed || status.subscribed) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-5">
        <IoCheckmarkCircle className="text-7xl text-emerald-400 mx-auto" />
        <div>
          <h3 className="text-2xl font-bold text-white">{t('tg.verified')}</h3>
          <p className="text-zinc-400 mt-2">{t('tg.verifiedDesc')}</p>
        </div>
        {onTelegramVerified && (
          <button
            onClick={onTelegramVerified}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/20"
          >
            {t('tg.continue')}
          </button>
        )}
      </div>
    )
  }

  // ─── Timeout ────────────────────────────────────────────────────────
  if (phase === 'timeout') {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#1a1218] p-6 space-y-5">
        <div className="text-center space-y-2">
          <IoCloseCircle className="text-6xl text-red-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">{t('tg.timeoutTitle')}</h3>
          <p className="text-zinc-400 text-sm">{t('tg.timeoutDesc')}</p>
        </div>
        <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
          <ChecklistItem done={false} text={t('tg.timeoutCheck1')} />
          <ChecklistItem done={false} text={t('tg.timeoutCheck2')} />
        </div>
        <button
          onClick={handleRetry}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <IoRefresh className="text-xl" />
          {t('tg.retryBtn')}
        </button>
      </div>
    )
  }

  // ─── Polling ────────────────────────────────────────────────────────
  if (phase === 'polling') {
    const progress = Math.min(100, (pollCount / MAX_POLL_ATTEMPTS) * 100)
    return (
      <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
        <div className="text-center space-y-1">
          <div className="w-16 h-16 bg-blue-500/10 border-2 border-blue-500/30 rounded-full flex items-center justify-center mx-auto">
            <FaTelegram className="text-3xl text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white pt-2">{t('tg.pollingTitle')}</h3>
          <p className="text-zinc-500 text-sm">{t('tg.pollingDesc')}</p>
        </div>

        {/* Bot status */}
        <StatusRow
          done={status.linked}
          waitText={t('tg.pollingBotWait')}
          doneText={t('tg.pollingBotDone')}
        />

        {/* Channel status */}
        <StatusRow
          done={status.subscribed}
          waitText={t('tg.pollingChannelWait')}
          doneText={t('tg.pollingChannelDone')}
        />

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-zinc-600 text-xs text-center">{t('tg.pollingHint')}</p>
        </div>

        {/* Channel reminder */}
        {showChannelReminder && (
          <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl">
            <IoAlertCircle className="text-amber-400 text-2xl shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm">{t('tg.channelNotSub')}</p>
          </div>
        )}

        {/* Network hint */}
        {showNetworkHint && (
          <p className="text-center text-zinc-600 text-xs">{t('tg.networkDelay')}</p>
        )}

        {/* Bot link copy fallback */}
        {botUrl && (
          <button
            onClick={copyBotLink}
            className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <IoCopyOutline />
            {t('tg.copyLink')}
          </button>
        )}
      </div>
    )
  }

  // ─── After channel (step 2 active) ─────────────────────────────────
  if (phase === 'after_channel') {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
        <Header />

        {/* Step 1 — done */}
        <StepCard
          number={1}
          done
          title={t('tg.step1Title')}
          desc={null}
          action={null}
        />

        {/* Step 2 — active */}
        <StepCard
          number={2}
          done={false}
          active
          title={t('tg.step2Title')}
          desc={t('tg.step2Desc')}
          action={
            <button
              onClick={handleConnectBot}
              disabled={botLinkLoading}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <FaTelegram className="text-xl" />
              {botLinkLoading ? t('tg.step2BtnLoading') : t('tg.step2Btn')}
            </button>
          }
        />
      </div>
    )
  }

  // ─── Start (both steps shown, step 1 active) ───────────────────────
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
      <Header />

      {/* Step 1 — active */}
      <StepCard
        number={1}
        done={false}
        active
        title={t('tg.step1Title')}
        desc={t('tg.step1Desc')}
        action={
          <div className="space-y-2">
            <button
              onClick={handleOpenChannel}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <FaTelegram className="text-xl" />
              {t('tg.step1Btn')}
            </button>
            <button
              onClick={handleChannelConfirm}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium rounded-xl transition-all"
            >
              {t('tg.step1Confirm')}
            </button>
          </div>
        }
      />

      {/* Step 2 — greyed out */}
      <StepCard
        number={2}
        done={false}
        active={false}
        title={t('tg.step2Title')}
        desc={null}
        action={null}
      />
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────

function Header() {
  const { t } = useLang()
  return (
    <div className="text-center space-y-2">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
        <FaTelegram className="text-3xl text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{t('tg.title')}</h3>
    </div>
  )
}

function StepCard({
  number,
  done,
  active = false,
  title,
  desc,
  action,
}: {
  number: number
  done: boolean
  active?: boolean
  title: string
  desc: string | null
  action: React.ReactNode | null
}) {
  const borderColor = done
    ? 'border-emerald-500/30 bg-emerald-500/5'
    : active
    ? 'border-blue-500/30 bg-blue-500/5'
    : 'border-white/5 bg-white/2 opacity-50'

  return (
    <div className={`rounded-2xl border-2 p-5 space-y-4 transition-all ${borderColor}`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 ${
            done
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : active
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
              : 'bg-white/5 border-white/10 text-zinc-500'
          }`}
        >
          {done ? <IoCheckmarkCircle className="text-emerald-400 text-xl" /> : number}
        </div>
        <p className={`font-bold text-base ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-zinc-500'}`}>
          {title}
        </p>
      </div>
      {desc && <p className="text-zinc-400 text-sm leading-relaxed pl-12">{desc}</p>}
      {action && <div className="pl-0">{action}</div>}
    </div>
  )
}

function StatusRow({
  done,
  waitText,
  doneText,
}: {
  done: boolean
  waitText: string
  doneText: string
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/3'
      }`}
    >
      <div className="shrink-0">
        {done ? (
          <IoCheckmarkCircle className="text-2xl text-emerald-400" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
        )}
      </div>
      <p className={`text-sm font-medium ${done ? 'text-emerald-300' : 'text-zinc-400'}`}>
        {done ? doneText : waitText}
      </p>
    </div>
  )
}

function ChecklistItem({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${done ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-600'}`}>
        {done && <IoCheckmarkCircle className="text-emerald-400 text-sm" />}
      </div>
      <p className="text-zinc-300 text-sm">{text}</p>
    </div>
  )
}
