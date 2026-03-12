import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import { IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'

import { verifyTelegram, selectTelegramSub, selectSubLoading } from '@store/slices/subscriptionSlice'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { SOCIAL_LINKS } from '@utils/constants'

export default function TelegramVerify() {
  const dispatch  = useDispatch()
  const telegram  = useSelector(selectTelegramSub)
  const loading   = useSelector(selectSubLoading)
  const [userId, setUserId] = useState('')

  const handleVerify = async () => {
    if (!userId.trim()) return toast.error('Telegram ID ni kiriting')
    const result = await dispatch(verifyTelegram({ telegramUserId: userId.trim() }))
    if (!result.error) {
      toast.success('Telegram obuna tasdiqlandi!')
    } else {
      toast.error(result.payload || 'Telegram tekshirishda xato')
    }
  }

  if (telegram.subscribed) {
    return (
      <div className="flex items-center gap-3 p-4 glass-card border border-success/30">
        <IoCheckmarkCircle className="text-3xl text-success flex-shrink-0" />
        <div>
          <p className="font-medium text-white text-sm">Telegram tasdiqlangan</p>
          <p className="text-xs text-zinc-400">@{telegram.username}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <FaTelegram className="text-3xl text-primary-400" />
        <div>
          <h3 className="font-semibold text-white">Telegram kanalga obuna bo'ling</h3>
          <p className="text-xs text-zinc-400">Kanalga obuna bo'ling, keyin tasdiqlang</p>
        </div>
      </div>

      {/* Step 1: Subscribe */}
      <a
        href={SOCIAL_LINKS.telegram}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20
                   hover:bg-primary-500/20 transition-colors text-sm text-primary-300"
      >
        <FaTelegram />
        Telegram kanalini ochish →
      </a>

      {/* Step 2: Enter ID */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400">
          Botimizga yozing: <strong className="text-white">/start</strong> → Sizning Telegram ID ni oling
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Telegram User ID (masalan: 123456789)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleVerify} loading={loading} size="sm">
            Tasdiqlash
          </Button>
        </div>
      </div>
    </div>
  )
}
