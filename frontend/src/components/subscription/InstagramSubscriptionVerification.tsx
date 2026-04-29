'use client'

import { useState } from 'react'
import { IoLogoInstagram, IoCheckmarkCircle, IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useLang } from '@/context/LangContext'

interface InstagramSubscriptionVerificationProps {
  videoId?: string
  onClose: () => void
  onSuccess: () => void
}

export default function InstagramSubscriptionVerification({
  videoId,
  onClose,
  onSuccess
}: InstagramSubscriptionVerificationProps) {
  const { t } = useLang()
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [hasVisitedProfile, setHasVisitedProfile] = useState<boolean>(false)

  const handleVisitProfile = (): void => {
    // Instagram profilini yangi tabda ochish
    window.open('https://instagram.com/aidevix_official', '_blank', 'noopener,noreferrer')
    setHasVisitedProfile(true)
    toast.success(t('igv.openedToast'))
  }

  const handleCheckSubscription = async (): Promise<void> => {
    if (!hasVisitedProfile) {
      toast.error(t('igv.visitFirstToast'))
      return
    }

    setIsChecking(true)

    try {
      // 2-3 soniyalik sun'iy yuklanish (API simulatsiyasi)
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Sun'iy obuna tekshirish (70% ehtimol bilan obuna bo'lgan)
      const subscriptionResult = Math.random() > 0.3

      if (subscriptionResult) {
        setIsSubscribed(true)
        toast.success(t('igv.successToast'))
        
        // 1 soniya kutib onSuccess chaqirish
        setTimeout(() => {
          onSuccess()
        }, 1000)
      } else {
        toast.error(t('igv.notFoundToast'))
      }
    } catch (error) {
      toast.error(t('igv.errorToast'))
    } finally {
      setIsChecking(false)
    }
  }

  // Agar obuna tasdiqlangan bo'lsa
  if (isSubscribed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-md mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <IoClose className="text-lg" />
          </button>

          {/* Success Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-green-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle className="text-4xl text-green-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t('igv.successTitle')}
                </h3>
                <p className="text-zinc-400">
                  {t('igv.successDesc')}
                </p>
              </div>

              <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <IoClose className="text-lg" />
        </button>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <IoLogoInstagram className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('igv.title')}
            </h2>
            <p className="text-zinc-400 text-sm">
              {t('igv.subtitle')}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {t('igv.step1Title')}
                </h3>
              </div>
              
              <button
                onClick={handleVisitProfile}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-2">
                  <IoLogoInstagram className="text-xl" />
                  <span>{t('igv.openButton')}</span>
                </div>
              </button>

              {hasVisitedProfile && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <IoCheckmarkCircle className="text-lg" />
                  <span>{t('igv.openedHint')}</span>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors ${
                  hasVisitedProfile ? 'bg-pink-500' : 'bg-zinc-600'
                }`}>
                  2
                </div>
                <h3 className={`text-lg font-semibold transition-colors ${
                  hasVisitedProfile ? 'text-white' : 'text-zinc-500'
                }`}>
                  {t('igv.step2Title')}
                </h3>
              </div>

              <button
                onClick={handleCheckSubscription}
                disabled={isChecking || !hasVisitedProfile}
                className={`w-full p-4 font-semibold rounded-xl transition-all duration-300 ${
                  hasVisitedProfile
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {isChecking ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('igv.checking')}</span>
                  </div>
                ) : (
                  t('igv.checkButton')
                )}
              </button>

              {!hasVisitedProfile && (
                <p className="text-zinc-500 text-xs text-center">
                  {t('igv.step1Required')}
                </p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
            <p className="text-zinc-400 text-xs text-center">
              {t('igv.info')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}