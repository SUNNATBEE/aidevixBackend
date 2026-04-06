import { useState } from 'react'
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
  videoId?: string // Video ID ni qo'shamiz
}

export default function SubscriptionGate({ 
  isOpen, 
  onClose, 
  onSuccess,
  videoId 
}: SubscriptionGateProps): JSX.Element | null {
  const instagram = useSelector(selectInstagramSub)
  const telegram = useSelector(selectTelegramSub)
  const [currentStep, setCurrentStep] = useState<'instagram' | 'telegram'>('instagram')

  console.log('SubscriptionGate render:', { 
    currentStep, 
    instagramSubscribed: instagram?.subscribed, 
    telegramSubscribed: telegram?.subscribed 
  })

  // Agar ikkala obuna ham tasdiqlangan bo'lsa, modal yopiladi
  if (instagram?.subscribed && telegram?.subscribed && onSuccess) {
    console.log('Both subscriptions verified, closing modal')
    onSuccess()
    return null
  }

  if (!isOpen) return null

  const handleInstagramVerified = () => {
    console.log('handleInstagramVerified called - switching to telegram')
    toast.success('✅ Instagram tasdiqlandi! Endi Telegram obunasini tekshiring')
    setCurrentStep('telegram')
  }

  const handleTelegramVerified = () => {
    console.log('handleTelegramVerified called - proceeding to video')
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
            currentStep === 'telegram' ? 'bg-green-500' : 
            currentStep === 'instagram' ? 'bg-pink-500' : 'bg-zinc-600'
          }`} />
          <div className="w-8 h-0.5 bg-zinc-600" />
          <div className={`w-3 h-3 rounded-full transition-colors ${
            currentStep === 'telegram' ? 'bg-blue-500' : 'bg-zinc-600'
          }`} />
        </div>

        {/* Step indicator */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-white">
            {currentStep === 'instagram' ? '1/2 - Instagram obunasi' : '2/2 - Telegram obunasi'}
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            {currentStep === 'instagram' 
              ? 'Instagram sahifamizga obuna bo\'ling va tasdiqlang' 
              : 'Telegram kanalimizga obuna bo\'ling va tasdiqlang'
            }
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

        {/* Debug info */}
        <div className="mt-4 p-2 bg-zinc-800/50 rounded text-xs text-zinc-500">
          Current Step: {currentStep}
        </div>
      </div>
    </div>
  )
}