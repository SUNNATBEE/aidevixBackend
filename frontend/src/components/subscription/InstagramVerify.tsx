'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle, IoWarning, IoAlertCircle, IoRefresh } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useLang } from '@/context/LangContext'
import { verifyInstagram, fetchSubscriptionStatus } from '@store/slices/subscriptionSlice'

type Phase = 'input' | 'opened' | 'checking' | 'failed' | 'success'

interface InstagramVerifyProps {
  onVerified?: () => void
}

const IG_PAGE = 'https://instagram.com/aidevix'
const FIRST_COUNTDOWN = 10   // 1-urinish: 10 sek → har doim fail
const SECOND_COUNTDOWN = 5   // 2-urinish: 5 sek → tasdiqlandi

export default function InstagramVerify({ onVerified }: InstagramVerifyProps) {
  const dispatch = useDispatch()
  const { t } = useLang()

  const [phase, setPhase] = useState<Phase>('input')
  const [username, setUsername] = useState('')
  const [countdown, setCountdown] = useState(FIRST_COUNTDOWN)
  const [apiLoading, setApiLoading] = useState(false)

  const usernameRef = useRef('')
  const attemptRef = useRef(0)            // 0 = 1-urinish, 1+ = 2-urinish
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const returnTriggeredRef = useRef(false)

  // ─── Countdown ──────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    const sec = attemptRef.current === 0 ? FIRST_COUNTDOWN : SECOND_COUNTDOWN
    setPhase('checking')
    setCountdown(sec)

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Countdown tugaganda API chaqirish
  useEffect(() => {
    if (countdown === 0 && phase === 'checking') {
      void callVerifyApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown])

  const callVerifyApi = async () => {
    // 1-urinish: har doim fail — userni haqiqatan Instagram ga borishga majburlash
    if (attemptRef.current === 0) {
      attemptRef.current = 1
      setPhase('failed')
      return
    }

    // 2-urinish: haqiqiy API call (soft-check, username berilsa tasdiqlanadi)
    setApiLoading(true)
    try {
      const res = await (dispatch as any)(
        verifyInstagram({ username: usernameRef.current })
      ).unwrap()

      if (res?.instagram?.subscribed) {
        setPhase('success')
        await dispatch(fetchSubscriptionStatus() as any)
        toast.success(t('ig.subConfirmed'))
      } else {
        setPhase('failed')
      }
    } catch {
      setPhase('failed')
    } finally {
      setApiLoading(false)
    }
  }

  // ─── Foydalanuvchi tabga qaytganini aniqlash ────────────────────────
  useEffect(() => {
    if (phase !== 'opened') return
    returnTriggeredRef.current = false

    const trigger = () => {
      if (returnTriggeredRef.current) return
      returnTriggeredRef.current = true
      startCountdown()
    }

    const setup = setTimeout(() => {
      window.addEventListener('focus', trigger)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) trigger()
      })
    }, 1200)

    return () => {
      clearTimeout(setup)
      window.removeEventListener('focus', trigger)
    }
  }, [phase, startCountdown])

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleOpenInstagram = () => {
    const clean = username.trim().replace(/^@/, '')
    if (!clean) { toast.error(t('ig.noUsername')); return }
    usernameRef.current = clean
    window.open(IG_PAGE, '_blank', 'noopener,noreferrer')
    setPhase('opened')
  }

  // "Tekshirish" — 2-urinish: Instagram ochib, tab ga qaytganda 5 sek countdown
  const handleRetryWithInstagram = () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    returnTriggeredRef.current = false
    const clean = username.trim().replace(/^@/, '')
    if (!clean) { toast.error(t('ig.noUsername')); return }
    usernameRef.current = clean
    window.open(IG_PAGE, '_blank', 'noopener,noreferrer')
    setPhase('opened')
  }

  const handleManualCheck = () => {
    if (returnTriggeredRef.current) return
    returnTriggeredRef.current = true
    startCountdown()
  }

  // ─── Render: success ───────────────────────────────────────────────
  if (phase === 'success') {
    return (
      <div className="rounded-2xl overflow-hidden border border-green-500/20 bg-[#0f1a14]">
        <div className="p-6 text-center space-y-3">
          <IoCheckmarkCircle className="text-5xl text-green-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">{t('ig.verified')}</h3>
          <p className="text-zinc-400 text-sm">@{usernameRef.current}</p>
        </div>

        <div className="mx-4 mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3">
          <IoWarning className="text-amber-400 text-xl shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">{t('ig.warnTitle')}</p>
            <p className="text-amber-200/70 text-xs mt-1">{t('ig.warnDesc')}</p>
          </div>
        </div>

        <div className="px-4 pb-5">
          <button
            onClick={onVerified}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
          >
            {t('ig.nextStep')}
          </button>
        </div>
      </div>
    )
  }

  // ─── Render: checking ──────────────────────────────────────────────
  if (phase === 'checking') {
    const totalSec = attemptRef.current === 0 ? FIRST_COUNTDOWN : SECOND_COUNTDOWN
    const progress = ((totalSec - countdown) / totalSec) * 100

    return (
      <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
        <div className="text-center space-y-2">
          <IoLogoInstagram className="text-4xl text-pink-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t('ig.checkingTitle')}</h3>
        </div>

        <div className="text-center">
          <div className="text-5xl font-black text-pink-400 tabular-nums">{countdown}</div>
          <p className="text-zinc-500 text-xs mt-1">{t('ig.checking')}</p>
        </div>

        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {apiLoading && (
          <p className="text-center text-zinc-400 text-sm animate-pulse">{t('ig.checking')}</p>
        )}
      </div>
    )
  }

  // ─── Render: failed ────────────────────────────────────────────────
  if (phase === 'failed') {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#1a1218] p-6 space-y-5">
        <div className="text-center space-y-2">
          <IoAlertCircle className="text-5xl text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t('ig.failedTitle')}</h3>
          <p className="text-zinc-400 text-sm">{t('ig.failedDesc')}</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder={t('ig.placeholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRetryWithInstagram()}
            className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 transition-colors text-sm"
          />
          <button
            onClick={handleRetryWithInstagram}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
          >
            <IoLogoInstagram className="text-lg" />
            {t('ig.retryOpenBtn')}
          </button>
        </div>
      </div>
    )
  }

  // ─── Render: opened (tabga qaytish kutilmoqda) ─────────────────────
  if (phase === 'opened') {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
        <div className="text-center space-y-2">
          <IoLogoInstagram className="text-4xl text-pink-400 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">{t('ig.openedTitle')}</h3>
          <p className="text-zinc-400 text-sm">{t('ig.openedDesc')}</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping shrink-0" />
          <p className="text-pink-300 text-xs">@{usernameRef.current}</p>
        </div>

        <button
          onClick={handleManualCheck}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium rounded-xl transition-all text-sm"
        >
          {t('ig.manualCheck')}
        </button>
      </div>
    )
  }

  // ─── Render: input (boshlang'ich) ──────────────────────────────────
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1c26] p-6 space-y-5">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
          <IoLogoInstagram className="text-3xl text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{t('ig.title')}</h3>
        <p className="text-zinc-400 text-sm">{t('ig.subtitle')}</p>
      </div>

      <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
        <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold flex items-center justify-center shrink-0">
          1
        </div>
        <p className="text-zinc-300 text-sm">
          Instagram&apos;da <strong className="text-pink-400">@aidevix</strong> ga obuna bo&apos;ling
        </p>
      </div>

      <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
        <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold flex items-center justify-center shrink-0">
          2
        </div>
        <p className="text-zinc-300 text-sm">Instagram username&apos;ingizni kiriting va tasdiqlang</p>
      </div>

      <div className="space-y-3 pt-1">
        <input
          type="text"
          placeholder={t('ig.placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleOpenInstagram()}
          className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 transition-colors text-sm"
        />

        <button
          onClick={handleOpenInstagram}
          disabled={!username.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
        >
          <IoLogoInstagram className="text-lg" />
          {t('ig.openBtn')}
        </button>
      </div>
    </div>
  )
}
