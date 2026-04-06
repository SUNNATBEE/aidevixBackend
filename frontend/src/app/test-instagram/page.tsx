'use client'

import { useState } from 'react'
import InstagramSubscriptionVerification from '@/components/subscription/InstagramSubscriptionVerification'

export default function TestInstagramPage() {
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleSuccess = () => {
    console.log('Instagram subscription verified successfully!')
    setShowModal(false)
    // Bu yerda video sahifasiga yo'naltirish yoki boshqa amallar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Instagram Verification Test
          </h1>
          <p className="text-zinc-400 text-lg">
            Professional Instagram obuna tekshirish komponentini sinab ko'ring
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Instagram Verification'ni ochish
        </button>

        {showModal && (
          <InstagramSubscriptionVerification
            videoId="test-video-123"
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  )
}