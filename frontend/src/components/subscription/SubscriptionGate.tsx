import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { selectInstagramSub, selectTelegramSub } from '@store/slices/subscriptionSlice'
import InstagramVerify from './InstagramVerify'
import TelegramVerify from './TelegramVerify'

interface SubscriptionGateProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  videoId?: string
}

export default function SubscriptionGate({ 
  isOpen, 
  onClose, 
  onSuccess,
  videoId 
}: SubscriptionGateProps): JSX.Element | null {
  const instagram = useSelector(selectInstagramSub)
  const telegram = useSelector(selectTelegramSub)

  // Qaysi obuna yo'qligini aniqlash
  const needsInstagram = !instagram?.subscribed
  const needsTelegram = !telegram?.subscribed

  const getInitialStep = (): 'instagram' | 'telegram' => {
    if (needsInstagram) return 'instagram'
    if (needsTelegram) return 'telegram'
    return 'instagram'
  }

  const [currentStep, setCurrentStep] = useState<'instagram' | 'telegram'>(getInitialStep())

  // Step ni obuna o'zgarganda yangilash
  useEffect(() => {
    setCurrentStep(getInitialStep())
  }, [instagram?.subscribed, telegram?.subscribed])

  // Agar ikkala obuna ham tasdiqlangan bo'lsa, modal yopiladi
  if (instagram?.subscribed && telegram?.subscribed && onSuccess) {
    onSuccess()
    return null
  }

  if (!isOpen) return null

  // Faqat kerakli steplarni hisoblash
  const totalSteps = (needsInstagram ? 1 : 0) + (needsTelegram ? 1 : 0)
  const currentStepNumber = currentStep === 'instagram' ? 1 : (needsInstagram ? 2 : 1)

  const handleInstagramVerified = () => {
    if (needsTelegram) {
      toast.success('✅ Instagram tasdiqlandi! Endi Telegram obunasini tekshiring')
      setCurrentStep('telegram')
    } else {
      toast.success('🎉 Instagram obunasi tasdiqlandi! Video ko\'rishga ruxsat berildi!')
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
          if (videoId) window.location.href = `/videos/${videoId}`
        }, 1500)
      }
    }
  }

  const handleTelegramVerified = () => {
    toast.success('🎉 Barcha obunalar tasdiqlandi! Video ko\'rishga ruxsat berildi!')
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
        if (videoId) {
          window.location.href = `/videos/${videoId}`
        }
      }, 1500)
    }
  }

  const stepLabel = currentStep === 'instagram' 
    ? 'Instagram obunasi' 
    : 'Telegram obunasi'

  const stepDesc = currentStep === 'instagram'
    ? 'Instagram sahifamizga obuna bo\'ling va tasdiqlang'
    : 'Telegram kanalimizga obuna bo\'ling va tasdiqlang'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <IoClose className="text-lg" />
        </button>

        {/* Progress indicator */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-colors ${
            currentStep === 'instagram' ? 'bg-pink-500' : 
            !needsInstagram ? 'bg-green-500' : 'bg-zinc-600'
          }`} />
          {totalSteps > 1 && (
            <>
              <div className="w-8 h-0.5 bg-zinc-600" />
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === 'telegram' ? 'bg-blue-500' : 
                !needsTelegram ? 'bg-green-500' : 'bg-zinc-600'
              }`} />
            </>
          )}
        </div>

        {/* Step indicator */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-white">
            {currentStepNumber}/{totalSteps} - {stepLabel}
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            {stepDesc}
          </p>
        </div>

        {/* Component based on current step */}
        {currentStep === 'instagram' ? (
          <InstagramVerify 
            videoId={videoId} 
            onVideoAccess={handleInstagramVerified}
            showVideoButton={false}
          />
        ) : (
          <TelegramVerify 
            onTelegramVerified={handleTelegramVerified}
          />
        )}

      </div>
    </div>
  )
}