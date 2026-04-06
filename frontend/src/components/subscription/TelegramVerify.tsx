import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  verifyTelegram,
  selectTelegramSub,
  selectSubLoading
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

  // Telegram obunasini tekshirish funksiyasi
  const checkTelegramSubscription = async (): Promise<void> => {
    if (!inputUserId.trim()) {
      toast.error('Telegram User ID ni kiriting')
      return
    }

    const cleanUserId = inputUserId.trim()
    setIsChecking(true)
    setCheckResult(null)

    try {
      // Backend API orqali haqiqiy Telegram obunasini tekshirish
      const response = await fetch('/api/subscriptions/check-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth token
        },
        body: JSON.stringify({
          telegramUserId: cleanUserId
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.data.isSubscribed) {
          setCheckResult({
            isSubscribed: true,
            message: `ID: ${cleanUserId} Aidevix Telegram kanaliga obuna bo'lgan ✅`
          })
          toast.success('Aidevix Telegram obunachisi tasdiqlandi!')
        } else {
          setCheckResult({
            isSubscribed: false,
            message: `ID: ${cleanUserId} hali Aidevix Telegram kanaliga obuna bo'lmagan ❌`
          })
          toast.error('Aidevix Telegram obunasi topilmadi. Iltimos, avval kanalga obuna bo\'ling')
        }
      } else {
        // Backend xatosi
        const errorData = await response.json().catch(() => ({}))
        setCheckResult({
          isSubscribed: false,
          message: errorData.message || 'Telegram obunasini tekshirishda xato'
        })
        toast.error(errorData.message || 'Tekshirishda xato yuz berdi')
      }
    } catch (error) {
      console.error('Telegram API error:', error)
      setCheckResult({
        isSubscribed: false,
        message: 'Internet aloqasi yoki server bilan bog\'lanishda muammo'
      })
      toast.error('Internet aloqasini tekshiring va qaytadan urinib ko\'ring')
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerify = async (): Promise<void> => {
    if (!inputUserId.trim()) {
      toast.error('Telegram User ID ni kiriting')
      return
    }

    if (!checkResult?.isSubscribed) {
      toast.error('Avval Telegram obunasini tekshiring')
      return
    }

    const cleanUserId = inputUserId.trim()
    
    // Mock tasdiqlash - har doim muvaffaqiyatli
    toast.success('Telegram obuna tasdiqlandi!')
    setInputUserId('')
    setCheckResult(null)
    
    // Telegram tasdiqlangandan keyin callback chaqirish
    if (onTelegramVerified) {
      console.log('Calling onTelegramVerified callback')
      setTimeout(() => {
        onTelegramVerified()
      }, 1000)
    }
  }

  // Obuna bo'lmagan holatda qayta obuna bo'lishni taklif qilish
  const handleRetrySubscription = (): void => {
    setCheckResult(null)
    setInputUserId('')
    toast.success('Iltimos, avval Telegram kanalimizga obuna bo\'ling')
  }

  // Состояние: уже подтверждён
  if (telegram?.subscribed) {
    return (
      <div className="glass-card border border-success/30 p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-success" />
          <div>
            <h3 className="text-lg font-semibold text-white">Telegram tasdiqlangan</h3>
            <p className="text-zinc-400">@{telegram.username}</p>
          </div>
        </div>
      </div>
    )
  }

  // Состояние: не подтверждён
  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      {/* Шапка */}
      <div className="text-center space-y-2">
        <FaTelegram className="text-3xl text-blue-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">Telegram kanalga obuna bo'ling</h3>
        <p className="text-xs text-zinc-400">Kanalga obuna bo'ling, keyin tasdiqlang</p>
      </div>

      {/* Шаг 1 — Переход на Telegram канал */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">1-qadam:</h4>
        <a
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg text-center text-blue-400 font-medium transition-colors"
        >
          Telegram kanalini ochish →
        </a>
      </div>

      {/* Шаг 2 — Получение ID */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">2-qadam:</h4>
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 Botimizga <code className="bg-blue-500/20 px-1 rounded">/start</code> yozing va User ID ni oling
          </p>
        </div>
      </div>

      {/* Шаг 3 — Ввод ID и проверка */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">3-qadam:</h4>
        
        {/* Real API ma'lumotlari */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaTelegram className="text-blue-400 text-lg" />
            <p className="text-sm font-semibold text-blue-300">
              Haqiqiy Telegram Obuna Tekshirish
            </p>
          </div>
          
          <p className="text-xs text-blue-200 mb-3">
            Har qanday Telegram User ID kiritishingiz mumkin. Tizim avtomatik ravishda Aidevix Telegram kanaliga obuna ekanligingizni tekshiradi.
          </p>
          
          <div className="space-y-2">
            <p className="text-xs text-cyan-300">
              🔍 Tekshirish jarayoni:
            </p>
            <div className="text-xs text-cyan-200 ml-4 space-y-1">
              <p>• Backend API orqali Telegram tekshirish</p>
              <p>• Aidevix Telegram kanali obunachilari</p>
              <p>• Real vaqtda natija</p>
            </div>
            
            <p className="text-xs text-green-300 mt-3">
              ✅ Agar obuna bo'lsangiz: Tasdiqlash tugmasi paydo bo'ladi
            </p>
            <p className="text-xs text-red-300">
              ❌ Agar obuna bo'lmasangiz: Obuna bo'lish taklif qilinadi
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Telegram User ID (masalan: 123456789)"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          
          {/* Проверка подписки */}
          <button
            onClick={checkTelegramSubscription}
            disabled={isChecking || !inputUserId.trim()}
            className="w-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 disabled:bg-blue-500/10 disabled:cursor-not-allowed text-blue-400 font-medium rounded-lg transition-colors"
          >
            {isChecking ? 'Tekshirilmoqda...' : 'Obunani tekshirish'}
          </button>

          {/* Результат проверки */}
          {checkResult && (
            <div className={`p-3 rounded-lg border ${
              checkResult.isSubscribed 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {checkResult.isSubscribed ? (
                  <IoCheckmarkCircle className="text-lg" />
                ) : (
                  <IoCloseCircle className="text-lg" />
                )}
                <span className="text-sm font-medium">{checkResult.message}</span>
              </div>
            </div>
          )}

          {/* Подтверждение - только если подписан */}
          {checkResult?.isSubscribed ? (
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Tasdiqlash...' : '✅ Telegram obunani tasdiqlash'}
            </button>
          ) : checkResult && !checkResult.isSubscribed ? (
            <div className="space-y-3">
              <button
                onClick={handleRetrySubscription}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                🔄 Qaytadan urinish
              </button>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 rounded-lg text-center text-blue-400 font-medium transition-colors"
              >
                📱 Telegram kanalga o'tish va obuna bo'lish
              </a>
            </div>
          ) : (
            <button
              onClick={handleVerify}
              disabled={true}
              className="w-full p-3 bg-gray-500/50 cursor-not-allowed text-gray-400 font-medium rounded-lg"
            >
              Avval obunani tekshiring
            </button>
          )}

          {/* Предупреждение и действия если не подписан */}
          {checkResult && !checkResult.isSubscribed && (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <IoWarning className="text-lg text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-400 font-medium">
                      Video ko'rish uchun Telegram kanalga obuna bo'lish shart!
                    </p>
                    <p className="text-xs text-yellow-300/80">
                      1. Telegram kanalimizga obuna bo'ling<br/>
                      2. Botdan User ID ni oling<br/>
                      3. Qaytadan ID ni tekshiring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Успешная подписка */}
          {checkResult?.isSubscribed && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <IoCheckmarkCircle className="text-lg text-green-400" />
                <div>
                  <p className="text-sm text-green-400 font-medium">
                    Ajoyib! Siz bizning Telegram obunachimiz
                  </p>
                  <p className="text-xs text-green-300/80">
                    Endi tasdiqlash tugmasini bosing
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}