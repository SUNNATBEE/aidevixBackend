// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// FAYL     : src/components/videos/VideoLinkModal.jsx
// ============================================================
//
// VAZIFA: Video Telegram havola modal komponentini yaratish
//
// ⚠️ MUHIM: Bu havola BIR MARTALIK ishlatiladi!
//   - Foydalanuvchi "Ochish" tugmasini bosgach, link bekor bo'ladi
//   - Backend'da isUsed = true ga o'zgaradi
//
// MODAL TARKIBI:
//
//  1. OGOHLANTIRISH BANNER:
//     - bg-yellow-500/10 border border-yellow-500/30
//     - IoWarning ikonkasi (sariq)
//     - "Bu havola bir martalik. Ochgandan keyin qayta ishlatib bo'lmaydi."
//
//  2. ASOSIY HOLAT (link bor, ishlatilmagan, opened=false):
//     - FaTelegram ikonkasi (katta, primary rang)
//     - Tavsif matni
//     - Muddati (expiresAt) ko'rsatilsa
//     - "Telegram'da ochish" tugmasi → handleOpen()
//
//  3. MUVAFFAQIYAT HOLATI (isUsed=true yoki opened=true):
//     - IoCheckmarkCircle (yashil, text-5xl)
//     - "Havola muvaffaqiyatli ochildi."
//     - "Yopish" tugmasi
//
// handleOpen() LOGIKASI:
//   - dispatch(useVideoLink(videoLink._id))
//   - Muvaffaqiyatli bo'lsa:
//     - setOpened(true)
//     - window.open(videoLink.telegramLink, '_blank', 'noopener,noreferrer')
//     - toast.success('Link muvaffaqiyatli ochildi!')
//   - Xato bo'lsa: toast.error()
//
// PROPS:
//   - isOpen: boolean
//   - onClose: function
//
// KERAKLI IMPORTLAR:
//   import { useState } from 'react'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { FaTelegram } from 'react-icons/fa'
//   import { IoCheckmarkCircle, IoTime, IoWarning } from 'react-icons/io5'
//   import toast from 'react-hot-toast'
//   import { useVideoLink, selectVideoLink } from '@store/slices/videoSlice'
// ============================================================

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import { IoCheckmarkCircle, IoTime, IoWarning, IoClose, IoCopy } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useVideoLink as markVideoLinkUsed, selectVideoLink } from '@store/slices/videoSlice'

export default function VideoLinkModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const videoLink = useSelector(selectVideoLink)
  const [opened, setOpened] = useState(false)
  
  if (!isOpen) return null

  const handleOpen = async () => {
    if (!videoLink?._id) return
    
    try {
      const resultAction = await dispatch(markVideoLinkUsed(videoLink._id))
      // Check if the action was fulfilled (RTK Thunk pattern)
      if (resultAction && markVideoLinkUsed.fulfilled.match(resultAction)) {
        setOpened(true)
        window.open(videoLink.telegramLink, '_blank', 'noopener,noreferrer')
        toast.success('Link muvaffaqiyatli ochildi!')
      } else {
        toast.error((resultAction as any)?.payload || 'Havolani ochishda xato yuz berdi')
      }
    } catch (err) {
      toast.error('Kutilmagan xato yuz berdi')
    }
  }

  const handleCopy = () => {
    if (videoLink?.telegramLink) {
      navigator.clipboard.writeText(videoLink.telegramLink)
      toast.success('Nushalandi!')
    }
  }

  const isAlreadyUsed = videoLink?.isUsed || opened

  return (
    <div className="modal modal-open bg-black/60 backdrop-blur-sm z-[999]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-box bg-[#1a1c2e] border border-white/10 relative max-w-md p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FaTelegram className="text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Telegram Havola</h3>
              <p className="text-xs text-zinc-400">Faqat siz uchun yaratildi</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-zinc-400 hover:text-white">
            <IoClose size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Warning Banner */}
          {!isAlreadyUsed && (
            <div className="flex gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <IoWarning className="text-yellow-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-yellow-500/90 leading-relaxed">
                Bu havola bir martalik. Ochgandan keyin qayta ishlatib bo'lmaydi.
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col items-center text-center space-y-4">
            {isAlreadyUsed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <IoCheckmarkCircle className="text-green-500" size={48} />
                </div>
                <h4 className="text-xl font-bold text-white">Havola muvaffaqiyatli ochildi</h4>
                <p className="text-sm text-zinc-400 mt-2">
                  Video endi Telegram ilovasida ochilgan bo'lishi kerak.
                </p>
                <button onClick={onClose} className="btn btn-primary w-full mt-8">
                  Yopish
                </button>
              </motion.div>
            ) : (
              <div className="w-full space-y-6">
                <div className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">BIR MARTALIK HAVOLA</span>
                  <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
                    <code className="text-xs text-blue-400 truncate flex-1 text-left">{videoLink?.telegramLink || 'https://t.me/example_link'}</code>
                    <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors">
                      <IoCopy size={16} />
                    </button>
                  </div>
                  {videoLink?.expiresAt && (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                      <IoTime size={12} />
                      <span>{new Date(videoLink.expiresAt).toLocaleTimeString()} gacha amal qiladi</span>
                    </div>
                  )}
                </div>

                <div className="w-full pt-2">
                  <button 
                    onClick={handleOpen}
                    disabled={!videoLink?.telegramLink}
                    className="btn btn-primary w-full gap-2 h-14 text-base font-bold shadow-lg shadow-primary/20"
                  >
                    <FaTelegram size={24} />
                    Telegramda ochish
                  </button>
                  <p className="text-[10px] text-zinc-500 mt-4 text-center">
                    Tugmani bosganingizda ushbu havola "ishlatilgan" deb belgilanadi
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
