// ============================================================
// OQUVCHI  : AZIZ
// BRANCH   : feature/aziz-subscription
// FAYL     : src/components/subscription/InstagramVerify.jsx
// ============================================================
//
// VAZIFA: Instagram obunasini tekshirish komponentini yaratish
//
// IKKI HOLAT:
//
//  1. ALLAQACHON TASDIQLANGAN (instagram.subscribed = true):
//     - ✅ IoCheckmarkCircle (yashil, text-3xl)
//     - "Instagram tasdiqlangan" matni 
//     - "@{instagram.username}" — text-zinc-400
//     - glass-card border border-success/30
//
//  2. TASDIQLANMAGAN:
//     a) SARLAVHA:
//        - IoLogoInstagram ikonkasi (text-3xl text-pink-400)
//        - "Instagram'ga obuna bo'ling"
//        - "Sahifamizga obuna bo'ling, keyin tasdiqlang" (text-xs)
//
//     b) 1-QADAM — INSTAGRAM SAHIFAGA O'TISH:
//        - <a href={SOCIAL_LINKS.instagram} target="_blank">
//        - "Instagram sahifasini ochish →"
//        - bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20
//
//     c) 2-QADAM — USERNAME KIRITISH:
//        - Input: placeholder="Instagram username (@username)"
//        - "Tasdiqlash" tugmasi → handleVerify()
//
// handleVerify() LOGIKASI:
//   - username bo'sh bo'lsa → toast.error('Instagram username ni kiriting')
//   - @ belgisini olib tashlash: username.trim().replace('@', '')
//   - dispatch(verifyInstagram({ instagramUsername: username }))
//   - Muvaffaqiyatli → toast.success('Instagram obuna tasdiqlandi!')
//   - Xato → toast.error(result.payload || 'Instagram tekshirishda xato')
//
// STATE:
//   - useSelector(selectInstagramSub) → { subscribed, username }
//   - useSelector(selectSubLoading)
//   - useState(username)
//
// KERAKLI IMPORTLAR:
//   import { useState } from 'react'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { IoLogoInstagram, IoCheckmarkCircle } from 'react-icons/io5'
//   import toast from 'react-hot-toast'
//   import { verifyInstagram, selectInstagramSub, selectSubLoading } from '@store/slices/subscriptionSlice'
//   import { SOCIAL_LINKS } from '@utils/constants'
// ============================================================

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { verifyInstagram, selectInstagramSub, selectSubLoading } from '@store/slices/subscriptionSlice'
import { SOCIAL_LINKS } from '@utils/constants'

export default function InstagramVerify() {
  const dispatch = useDispatch()
  const instagram = useSelector(selectInstagramSub)
  const loading = useSelector(selectSubLoading)
  const [inputUsername, setInputUsername] = useState('')

  const handleVerify = async () => {
    if (!inputUsername.trim()) {
      toast.error('Instagram username ni kiriting')
      return
    }

    const cleanUsername = inputUsername.trim().replace('@', '')
    
    try {
      const result = await dispatch(verifyInstagram({ instagramUsername: cleanUsername }))
      
      if (result.type.endsWith('/fulfilled')) {
        toast.success('Tasdiqlandi')
        setInputUsername('')
      } else {
        toast.error(result.payload || 'Instagram tekshirishda xato')
      }
    } catch (error) {
      toast.error('Instagram tekshirishda xato')
    }
  }

  // Agar Instagram allaqachon tasdiqlangan bo'lsa
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

  // Tasdiqlanmagan holat
  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      {/* Sarlavha */}
      <div className="text-center space-y-2">
        <IoLogoInstagram className="text-3xl text-pink-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">Instagram'ga obuna bo'ling</h3>
        <p className="text-xs text-zinc-400">Sahifamizga obuna bo'ling, keyin tasdiqlang</p>
      </div>

      {/* 1-qadam - Instagram sahifasiga o'tish */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">1-qadam:</h4>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 rounded-lg text-center text-pink-400 font-medium transition-colors"
        >
          Instagram sahifasini ochish →
        </a>
      </div>

      {/* 2-qadam - Username kiritish */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">2-qadam:</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Instagram username (@username)"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/50"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full p-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </button>
        </div>
      </div>
    </div>
  )
}
