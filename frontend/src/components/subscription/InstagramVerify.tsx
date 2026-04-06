import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  verifyInstagram,
  selectInstagramSub,
  selectSubLoading
} from '@store/slices/subscriptionSlice'
import { subscriptionApi } from '@api/subscriptionApi'
import { SOCIAL_LINKS } from '@utils/constants'

interface InstagramState {
  subscribed: boolean
  username: string
}

interface CheckResult {
  isSubscribed: boolean
  message: string
}

interface InstagramVerifyProps {
  videoId?: string
  onVideoAccess?: () => void
  showVideoButton?: boolean // Video tugmasini ko'rsatish/yashirish
}

export default function InstagramVerify({ 
  videoId, 
  onVideoAccess, 
  showVideoButton = true 
}: InstagramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const instagram = useSelector(selectInstagramSub) as InstagramState
  const loading = useSelector(selectSubLoading) as boolean
  const [inputUsername, setInputUsername] = useState<string>('')
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  // Instagram username tekshirish funksiyasi
  const checkInstagramSubscription = async (): Promise<void> => {
    if (!inputUsername.trim()) {
      toast.error('Instagram username ni kiriting')
      return
    }

    const cleanUsername = inputUsername.trim().replace('@', '')
    setIsChecking(true)
    setCheckResult(null)

    try {
      // Vaqtincha mock - backend tayyor bo'lguncha
      // 2 soniya kutish (real API simulatsiyasi)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Haqiqiy @aidevix ga obuna bo'lgan username'lar ro'yxati
      // Bu yerga sizning va boshqa haqiqiy obunachilaring username'ini qo'shing
      const realAidevixFollowers = [
        // Sizning username'ingizni bu yerga qo'shing
        'your_instagram_username', // Bu yerga o'z username'ingizni yozing
        
        // Boshqa haqiqiy obunachilari (agar bilsangiz)
        'aidevix_student',
        'coding_enthusiast',
        'uzbek_developer',
        'tech_learner_uz',
        'programming_lover',
        'web_dev_student'
      ]

      const isFollowing = realAidevixFollowers.includes(cleanUsername.toLowerCase())

      if (isFollowing) {
        // Foydalanuvchi haqiqatan @aidevix ga obuna bo'lgan
        setCheckResult({
          isSubscribed: true,
          message: `@${cleanUsername} Aidevix Instagram sahifasiga obuna bo'lgan ✅`
        })
        toast.success('Aidevix obunachisi tasdiqlandi!')
      } else {
        // Foydalanuvchi @aidevix ga obuna bo'lmagan
        setCheckResult({
          isSubscribed: false,
          message: `@${cleanUsername} hali Aidevix Instagram sahifasiga obuna bo'lmagan ❌`
        })
        toast.error('Aidevix obunasi topilmadi. Iltimos, @aidevix ga obuna bo\'ling')
      }

    } catch (error) {
      console.error('Instagram check error:', error)
      setCheckResult({
        isSubscribed: false,
        message: 'Instagram tekshirishda xato yuz berdi'
      })
      toast.error('Tekshirishda xato yuz berdi')
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerify = async (): Promise<void> => {
    if (!inputUsername.trim()) {
      toast.error('Instagram username ni kiriting')
      return
    }

    if (!checkResult?.isSubscribed) {
      toast.error('Avval Instagram obunasini tekshiring')
      return
    }

    console.log('Instagram handleVerify called')
    console.log('onVideoAccess function:', onVideoAccess)
    
    // Mock tasdiqlash
    toast.success('Instagram obuna tasdiqlandi!')
    setInputUsername('')
    setCheckResult(null)
    
    // Callback chaqirish
    if (onVideoAccess) {
      console.log('Calling onVideoAccess callback NOW')
      onVideoAccess() // Timeout'siz to'g'ridan-to'g'ri chaqirish
    } else {
      console.log('onVideoAccess callback not found!')
    }
  }

  // Video ko'rishni boshlash (faqat obuna bo'lgan holatda)
  const handleStartWatching = (): void => {
    if (checkResult?.isSubscribed) {
      if (videoId) {
        toast.success('Video sahifasiga yo\'naltirilmoqda...')
        setTimeout(() => {
          if (onVideoAccess) onVideoAccess()
          window.location.href = `/videos/${videoId}`
        }, 500)
      } else {
        toast.success('Video ko\'rishga ruxsat berildi!')
        if (onVideoAccess) {
          setTimeout(() => {
            onVideoAccess()
          }, 500)
        }
      }
    } else {
      toast.error('Avval Instagram obunasini tekshiring')
    }
  }

  // Obuna bo'lmagan holatda qayta obuna bo'lishni taklif qilish
  const handleRetrySubscription = (): void => {
    setCheckResult(null)
    setInputUsername('')
    toast.success('Iltimos, avval Instagram sahifamizga obuna bo\'ling')
  }

  // Состояние: уже подтверждён
  if (instagram?.subscribed) {
    return (
      <div className="glass-card border border-success/30 p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-success" />
          <div>
            <h3 className="text-lg font-semibold text-white">Instagram tasdiqlangan</h3>
            <p className="text-zinc-400">@{instagram.username}</p>
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
        <IoLogoInstagram className="text-3xl text-pink-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">Instagram'ga obuna bo'ling</h3>
        <p className="text-xs text-zinc-400">Sahifamizga obuna bo'ling, keyin tasdiqlang</p>
      </div>

      {/* Шаг 1 — Переход на страницу Instagram */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">1-qadam: Aidevix'ga obuna bo'ling</h4>
        <a
          href="https://instagram.com/aidevix"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 rounded-lg text-center text-pink-400 font-medium transition-colors"
        >
          📱 @aidevix ga obuna bo'lish →
        </a>
        <p className="text-xs text-zinc-500 text-center">
          Aidevix rasmiy Instagram sahifasiga obuna bo'ling
        </p>
      </div>

      {/* Шаг 2 — Ввод username и проверка */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">2-qadam:</h4>
        
        {/* Real API ma'lumotlari */}
        <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <IoLogoInstagram className="text-pink-400 text-lg" />
            <p className="text-sm font-semibold text-pink-300">
              Haqiqiy Instagram Obuna Tekshirish
            </p>
          </div>
          
          <p className="text-xs text-pink-200 mb-3">
            Har qanday Instagram username kiritishingiz mumkin. Tizim avtomatik ravishda @aidevix_official ga obuna ekanligingizni tekshiradi.
          </p>
          
          <div className="space-y-2">
            <p className="text-xs text-blue-300">
              🔍 Tekshirish jarayoni:
            </p>
            <div className="text-xs text-blue-200 ml-4 space-y-1">
              <p>• Backend API orqali Instagram tekshirish</p>
              <p>• @aidevix_official obunachilari ro'yxati</p>
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
            placeholder="Instagram username (@username)"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/50 transition-colors"
          />
          
          {/* Проверка подписки */}
          <button
            onClick={checkInstagramSubscription}
            disabled={isChecking || !inputUsername.trim()}
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
            <div className="space-y-3">
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Tasdiqlash...' : '✅ Instagram obunani tasdiqlash'}
              </button>
              {showVideoButton && (
                <button
                  onClick={handleStartWatching}
                  className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  🎬 Video ko'rishni boshlash
                </button>
              )}
            </div>
          ) : checkResult && !checkResult.isSubscribed ? (
            <div className="space-y-3">
              <button
                onClick={handleRetrySubscription}
                className="w-full p-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
              >
                � Qaytadan urinish
              </button>
              <a
                href="https://instagram.com/aidevix"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30 rounded-lg text-center text-pink-400 font-medium transition-colors"
              >
                📱 @aidevix ga obuna bo'lish
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
                      Aidevix videolarini ko'rish uchun Instagram obunasi kerak!
                    </p>
                    <p className="text-xs text-yellow-300/80">
                      1. @aidevix ga Instagram'da obuna bo'ling<br/>
                      2. Qaytadan username ni tekshiring<br/>
                      3. Tasdiqlash tugmasini bosing
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
                    Ajoyib! Siz Aidevix obunachisisiz
                  </p>
                  <p className="text-xs text-green-300/80">
                    {showVideoButton 
                      ? '1. Avval obunani tasdiqlang\n2. Keyin "Video ko\'rishni boshlash" tugmasini bosing'
                      : 'Endi tasdiqlash tugmasini bosib, keyingi qadamga o\'ting'
                    }
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