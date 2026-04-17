import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  verifyTelegram,
  selectTelegramSub,
  selectSubLoading,
} from '@store/slices/subscriptionSlice'
import { SOCIAL_LINKS } from '@utils/constants'

interface TelegramState {
  subscribed: boolean
  username: string
}

interface CheckResult {
  isSubscribed: boolean
  message: string
}

interface TelegramVerifyProps {
  onTelegramVerified?: () => void
}

export default function TelegramVerify({ onTelegramVerified }: TelegramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const telegram = useSelector(selectTelegramSub) as TelegramState
  const loading = useSelector(selectSubLoading) as boolean
  const [inputUserId, setInputUserId] = useState<string>('')
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkTelegramSubscription = async (): Promise<void> => {
    if (!inputUserId.trim()) {
      toast.error('Telegram User ID ni kiriting')
      return
    }

    const cleanUserId = inputUserId.trim()
    setIsChecking(true)
    setCheckResult(null)

    try {
      const data = await (dispatch as any)(verifyTelegram({
        telegramUserId: cleanUserId,
        username: 'telegram_user',
      })).unwrap()

      if (data?.telegram?.subscribed) {
        setCheckResult({
          isSubscribed: true,
          message: `ID: ${cleanUserId} Aidevix kanaliga obuna bo'lgan`,
        })
        toast.success('Obuna tasdiqlandi!')
      } else {
        setCheckResult({
          isSubscribed: false,
          message: `ID: ${cleanUserId} hali kanalga obuna bo'lmagan`,
        })
        toast.error('Obuna topilmadi. Iltimos, avval kanalga obuna bo\'ling')
      }
    } catch (error) {
      console.error('Telegram API error:', error)
      setCheckResult({
        isSubscribed: false,
        message: 'Server bilan bog\'lanishda muammo yuz berdi',
      })
      toast.error('Internet aloqasini tekshiring')
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerify = async (): Promise<void> => {
    if (!checkResult?.isSubscribed) {
      toast.error('Avval obunani tekshiring')
      return
    }

    toast.success('Barcha obunalar muvaffaqiyatli tasdiqlandi!')

    if (onTelegramVerified) {
      onTelegramVerified()
    }
  }

  if (telegram?.subscribed) {
    return (
      <div className="glass-card border border-emerald-500/30 p-6 rounded-xl bg-emerald-500/5 space-y-4">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-emerald-500" />
          <div>
            <h3 className="text-lg font-semibold text-white">Telegram hozir tasdiqlangan</h3>
            <p className="text-zinc-400">Darslarni ko'rishda davom eting</p>
          </div>
        </div>
        <button
          onClick={onTelegramVerified}
          className="w-full p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
        >
          Tasdiqlash va tugatish →
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl space-y-6 bg-[#1a1c26] border border-white/5 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <FaTelegram className="text-3xl text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Telegram Verifikatsiya</h3>
        <p className="text-sm text-zinc-400">Telegram kanalimizga obuna bo'lishingiz shart</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">1</div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-zinc-200 font-medium">Kanalga obuna bo'ling</p>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
              KANALNI OCHISH →
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">2</div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-zinc-200 font-medium">ID raqamingizni oling</p>
            <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
              <p className="text-xs text-zinc-400 italic">
                Botimizga <code className="text-blue-400">/id</code> yoki <code className="text-blue-400">/start</code> yozing:
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a href="https://t.me/aidevix_bot" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:underline">@aidevix_bot</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">3</div>
          <div className="space-y-3 flex-1">
            <p className="text-sm text-zinc-200 font-medium">ID ni kiriting</p>
            <input
              type="text"
              placeholder="Masalan: 12345678"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />

            <button
              onClick={checkTelegramSubscription}
              disabled={isChecking || loading || !inputUserId.trim()}
              className="w-full p-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isChecking || loading ? 'Tekshirilmoqda...' : 'OBUNANI TEKSHIRISH'}
            </button>

            {checkResult && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                checkResult.isSubscribed
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {checkResult.isSubscribed ? <IoCheckmarkCircle className="text-xl" /> : <IoCloseCircle className="text-xl" />}
                <span className="text-xs font-bold uppercase tracking-wider">{checkResult.message}</span>
              </div>
            )}

            {checkResult?.isSubscribed && (
              <button
                onClick={handleVerify}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/30"
              >
                TASDIQLASH VA DAVOM ETTIRISH
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
