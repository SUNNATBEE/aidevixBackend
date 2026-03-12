import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'

import { verifyInstagram, selectInstagramSub, selectSubLoading } from '@store/slices/subscriptionSlice'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { SOCIAL_LINKS } from '@utils/constants'

export default function InstagramVerify() {
  const dispatch  = useDispatch()
  const instagram = useSelector(selectInstagramSub)
  const loading   = useSelector(selectSubLoading)
  const [username, setUsername] = useState('')

  const handleVerify = async () => {
    if (!username.trim()) return toast.error('Instagram username ni kiriting')
    const result = await dispatch(verifyInstagram({ instagramUsername: username.trim().replace('@', '') }))
    if (!result.error) {
      toast.success('Instagram obuna tasdiqlandi!')
    } else {
      toast.error(result.payload || 'Instagram tekshirishda xato')
    }
  }

  if (instagram.subscribed) {
    return (
      <div className="flex items-center gap-3 p-4 glass-card border border-success/30">
        <IoCheckmarkCircle className="text-3xl text-success flex-shrink-0" />
        <div>
          <p className="font-medium text-white text-sm">Instagram tasdiqlangan</p>
          <p className="text-xs text-zinc-400">@{instagram.username}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <IoLogoInstagram className="text-3xl text-pink-400" />
        <div>
          <h3 className="font-semibold text-white">Instagram'ga obuna bo'ling</h3>
          <p className="text-xs text-zinc-400">Sahifamizga obuna bo'ling, keyin tasdiqlang</p>
        </div>
      </div>

      {/* Step 1: Follow */}
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20
                   hover:bg-pink-500/20 transition-colors text-sm text-pink-300"
      >
        <IoLogoInstagram />
        Instagram sahifasini ochish →
      </a>

      {/* Step 2: Enter username */}
      <div className="flex gap-2">
        <Input
          placeholder="Instagram username (@username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleVerify} loading={loading} size="sm">
          Tasdiqlash
        </Button>
      </div>
    </div>
  )
}
