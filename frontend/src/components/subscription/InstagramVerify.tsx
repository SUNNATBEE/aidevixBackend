import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useLang } from '@context/LangContext'
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
  const { t } = useLang()
  const [inputUsername, setInputUsername] = useState<string>('')
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkInstagramSubscription = async (): Promise<void> => {
    if (!inputUsername.trim()) {
      toast.error(t('ig.noUsername'))
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
          message: `${t('ig.subConfirmed')} @${cleanUsername}`,
        })
        toast.success(t('ig.subConfirmed'))
      } else {
        setCheckResult({
          isSubscribed: false,
          message: response?.message || `@${cleanUsername} ${t('ig.notFound')}`,
        })
        toast.error(t('ig.notFound'))
      }
    } catch (error: any) {
      console.error('Instagram check error:', error)
      setCheckResult({
        isSubscribed: false,
        message: error || t('profile.toast.error'),
      })
      toast.error(error || t('profile.toast.error'))
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerify = (): void => {
    if (!checkResult?.isSubscribed) {
      toast.error(t('ig.checkFirst'))
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
      toast.error(t('ig.checkFirst'))
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
    toast.success(t('ig.retryMsg'))
  }

  if (instagram?.subscribed) {
    return (
      <div className="glass-card border border-success/30 p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-success" />
          <div>
            <h3 className="text-lg font-semibold text-white">{t('ig.verified')}</h3>
            <p className="text-zinc-400">@{instagram.username}</p>
          </div>
        </div>
        <button
          onClick={onVideoAccess}
          className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('ig.nextStep')}
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div className="text-center space-y-2">
        <IoLogoInstagram className="text-3xl text-pink-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">{t('ig.title')}</h3>
        <p className="text-xs text-zinc-400">{t('ig.subtitle')}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">{t('ig.step1')}</h4>
        <a
          href="https://instagram.com/aidevix"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 rounded-lg text-center text-pink-400 font-medium transition-colors"
        >
          {t('ig.step1Link')}
        </a>
        <p className="text-xs text-zinc-500 text-center">
          {t('ig.apiNote')}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">{t('ig.step2')}</h4>

        <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <IoLogoInstagram className="text-pink-400 text-lg" />
            <p className="text-sm font-semibold text-pink-300">
              {t('ig.checkTitle')}
            </p>
          </div>

          <p className="text-xs text-pink-200 mb-3">
            {t('ig.checkNote')}
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder={t('ig.placeholder')}
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/50 transition-colors"
          />

          <button
            onClick={checkInstagramSubscription}
            disabled={isChecking || loading || !inputUsername.trim()}
            className="w-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 disabled:bg-blue-500/10 disabled:cursor-not-allowed text-blue-400 font-medium rounded-lg transition-colors"
          >
            {isChecking || loading ? t('ig.checking') : t('ig.checkBtn')}
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
                {loading ? t('ig.confirming') : t('ig.confirmBtn')}
              </button>
              {showVideoButton && (
                <button
                  onClick={handleStartWatching}
                  className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  {t('ig.watchBtn')}
                </button>
              )}
            </div>
          ) : checkResult ? (
            <div className="space-y-3">
              <button
                onClick={handleRetrySubscription}
                className="w-full p-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
              >
                {t('ig.retryBtn')}
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
              {t('ig.notVerified')}
            </button>
          )}

          {checkResult && !checkResult.isSubscribed && (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <IoWarning className="text-lg text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-400 font-medium">
                      {t('ig.failTitle')}
                    </p>
                    <p className="text-xs text-yellow-300/80">
                      {t('ig.failSteps')}
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
