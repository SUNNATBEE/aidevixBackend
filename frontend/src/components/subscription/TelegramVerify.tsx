import { useState, useEffect, useRef } from 'react'
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

interface TelegramVerifyProps {
  onTelegramVerified?: () => void
}

export default function TelegramVerify({ onTelegramVerified }: TelegramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const telegram = useSelector(selectTelegramSub)
  const loading = useSelector(selectSubLoading)
  
  const [isAutoChecking, setIsAutoChecking] = useState(false)
  const [verifyData, setVerifyData] = useState<{ token: string; botUsername: string } | null>(null)
  const [status, setStatus] = useState<{ linked: boolean; subscribed: boolean }>({ linked: false, subscribed: false })
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Token yaratish
  const startAutoVerify = async () => {
    try {
      setIsAutoChecking(true)
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
      toast.error('Token yaratishda xato yuz berdi')
      setIsAutoChecking(false)
    }
  }

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    
    pollingRef.current = setInterval(async () => {
      try {
        const res = await subscriptionApi.checkToken()
        if (res.data.success) {
          const { linked, subscribed } = res.data.data
          setStatus({ linked, subscribed })
          
          if (linked && subscribed) {
            stopPolling()
            toast.success('🎉 Telegram muvaffaqiyatli tasdiqlandi!')
            // Redux stateni yangilash
            dispatch(fetchSubscriptionStatus() as any)
            if (onTelegramVerified) onTelegramVerified()
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 3000)
  }

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  if (telegram?.subscribed || status.subscribed) {
    return (
      <div className="glass-card border border-emerald-500/30 p-8 rounded-2xl bg-emerald-500/5 text-center space-y-4">
        <IoCheckmarkCircle className="text-6xl text-emerald-500 mx-auto" />
        <div>
          <h3 className="text-xl font-bold text-white">Telegram tasdiqlandi</h3>
          <p className="text-zinc-400 mt-2">Endi darslarni ko'rishda davom etishga tayyorsiz!</p>
        </div>
        <button
          onClick={onTelegramVerified}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20"
        >
          DAVOM ETTIRISH →
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
        <h3 className="text-2xl font-black text-white tracking-tight">Telegram Verifikatsiya</h3>
        <p className="text-sm text-zinc-400 max-w-xs mx-auto">Avtomatik tizim orqali 10 soniyada tasdiqlang</p>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Step 1: Subscribe */}
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0 border border-blue-500/20">1</div>
          <div className="flex-1">
            <p className="text-sm text-zinc-200 font-bold">Kanalga obuna bo'ling</p>
            <p className="text-xs text-zinc-500">Aidevix yangiliklarini o'tkazib yubormang</p>
          </div>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-lg hover:bg-blue-400 transition-all"
          >
            A'ZO BO'LISH
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
                {status.linked ? 'Telegram bog\'landi' : 'Akkauntni ulaning'}
              </p>
              {!status.linked ? (
                <button
                  onClick={startAutoVerify}
                  disabled={isAutoChecking}
                  className="mt-3 w-full py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  {isAutoChecking ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                  BOT ORQALI BOG'LASH
                </button>
              ) : (
                <p className="text-xs text-emerald-500/70 mt-1 font-medium italic">Sizning Telegram ID aniqlandi ✅</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator while waiting */}
        {isAutoChecking && !status.subscribed && (
          <div className="flex items-center justify-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5 animate-pulse">
            <FaSpinner className="animate-spin text-blue-400" />
            <p className="text-xs text-zinc-400 font-medium">Botdan tasdiqlashingizni kutyapman...</p>
          </div>
        )}

        <div className="flex items-center gap-2 px-2 text-[10px] text-zinc-500">
          <IoInformationCircle className="text-sm shrink-0" />
          <p>Botga o'tib <b>"START"</b> tugmasini bosishingiz kifoya, qolganini tizim o'zi bajaradi.</p>
        </div>
      </div>
    </div>
  )
}
