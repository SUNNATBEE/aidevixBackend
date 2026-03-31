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

export default function InstagramVerify() {
  // TODO: AZIZ bu komponentni to'liq yozadi
  return null
}
