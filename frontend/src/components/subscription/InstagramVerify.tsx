import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  verifyInstagram,
  selectInstagramSub,
  selectSubLoading,
} from '@store/slices/subscriptionSlice'

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
  showVideoButton?: boolean
}

export default function InstagramVerify({
  videoId,
  onVideoAccess,
  showVideoButton = true,
}: InstagramVerifyProps): JSX.Element {
  const dispatch = useDispatch()
  const instagram = useSelector(selectInstagramSub) as InstagramState
  const loading = useSelector(selectSubLoading) as boolean
  const [inputUsername, setInputUsername] = useState<string>('')
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkInstagramSubscription = async (): Promise<void> => {
    if (!inputUsername.trim()) {
      toast.error('Instagram username ni kiriting')
      return
    }

    const cleanUsername = inputUsername.trim().replace('@', '')
    setIsChecking(true)
    setCheckResult(null)

    try {
      const response = await (dispatch as any)(verifyInstagram({ username: cleanUsername })).unwrap()

      if (response?.instagram?.subscribed) {
        setCheckResult({
          isSubscribed: true,
          message: `@${cleanUsername} Aidevix Instagram sahifasiga obuna bo'lgan`,
        })
        toast.success('Obuna tasdiqlandi!')
      } else {
        setCheckResult({
          isSubscribed: false,
          message: response?.message || `@${cleanUsername} hali Aidevix sahifasiga obuna bo'lmagan`,
        })
        toast.error('Obuna topilmadi')
      }
    } catch (error: any) {
      console.error('Instagram check error:', error)
      setCheckResult({
        isSubscribed: false,
        message: error || 'Instagram tekshirishda xato yuz berdi',
      })
      toast.error(error || 'Tekshirishda xato yuz berdi')
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerify = (): void => {
    if (!checkResult?.isSubscribed) {
      toast.error('Avval Instagram obunasini tekshiring')
      return
    }

    setInputUsername('')
    setCheckResult(null)

    if (onVideoAccess) {
      onVideoAccess()
    }
  }

  const handleStartWatching = (): void => {
    if (!checkResult?.isSubscribed) {
      toast.error('Avval Instagram obunasini tekshiring')
      return
    }

    if (videoId) {
      window.location.href = `/videos/${videoId}`
      return
    }

    if (onVideoAccess) {
      onVideoAccess()
    }
  }

  const handleRetrySubscription = (): void => {
    setCheckResult(null)
    setInputUsername('')
    toast.success('Iltimos, avval Instagram sahifamizga obuna bo\'ling')
  }

  if (instagram?.subscribed) {
    return (
      <div className="glass-card border border-success/30 p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-success" />
          <div>
            <h3 className="text-lg font-semibold text-white">Instagram tasdiqlangan</h3>
            <p className="text-zinc-400">@{instagram.username}</p>
          </div>
        </div>
        <button
          onClick={onVideoAccess}
          className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Keyingi qadam (Telegram) →
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div className="text-center space-y-2">
        <IoLogoInstagram className="text-3xl text-pink-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">Instagram&apos;ga obuna bo&apos;ling</h3>
        <p className="text-xs text-zinc-400">Sahifamizga obuna bo&apos;ling, keyin username orqali tekshiring</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">1-qadam: Aidevix&apos;ga obuna bo&apos;ling</h4>
        <a
          href="https://instagram.com/aidevix"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 rounded-lg text-center text-pink-400 font-medium transition-colors"
        >
          @aidevix ga obuna bo&apos;lish →
        </a>
        <p className="text-xs text-zinc-500 text-center">
          Real follower API cheklangan. Server faqat tekshira olgan holatdagina tasdiqlaydi.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">2-qadam:</h4>

        <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <IoLogoInstagram className="text-pink-400 text-lg" />
            <p className="text-sm font-semibold text-pink-300">
              Instagram username tekshiruvi
            </p>
          </div>

          <p className="text-xs text-pink-200 mb-3">
            Username yuboriladi. Server tasdiqlamasa access berilmaydi.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Instagram username (@username)"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/50 transition-colors"
          />

          <button
            onClick={checkInstagramSubscription}
            disabled={isChecking || loading || !inputUsername.trim()}
            className="w-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 disabled:bg-blue-500/10 disabled:cursor-not-allowed text-blue-400 font-medium rounded-lg transition-colors"
          >
            {isChecking || loading ? 'Tekshirilmoqda...' : 'Obunani tekshirish'}
          </button>

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

          {checkResult?.isSubscribed ? (
            <div className="space-y-3">
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Tasdiqlash...' : 'Instagram obunani tasdiqlash'}
              </button>
              {showVideoButton && (
                <button
                  onClick={handleStartWatching}
                  className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Video ko&apos;rishni boshlash
                </button>
              )}
            </div>
          ) : checkResult ? (
            <div className="space-y-3">
              <button
                onClick={handleRetrySubscription}
                className="w-full p-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
              >
                Qaytadan urinish
              </button>
              <a
                href="https://instagram.com/aidevix"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30 rounded-lg text-center text-pink-400 font-medium transition-colors"
              >
                @aidevix ga obuna bo&apos;lish
              </a>
            </div>
          ) : (
            <button
              onClick={handleVerify}
              disabled
              className="w-full p-3 bg-gray-500/50 cursor-not-allowed text-gray-400 font-medium rounded-lg"
            >
              Avval obunani tekshiring
            </button>
          )}

          {checkResult && !checkResult.isSubscribed && (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <IoWarning className="text-lg text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-400 font-medium">
                      Instagram verifikatsiyasi muvaffaqiyatsiz bo&apos;ldi
                    </p>
                    <p className="text-xs text-yellow-300/80">
                      1. @aidevix ga Instagram&apos;da obuna bo&apos;ling
                      <br />
                      2. Username&apos;ni qayta kiriting
                      <br />
                      3. Yana tekshirib ko&apos;ring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
