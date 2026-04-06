import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoLogoInstagram, IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import {
  verifyInstagram,
  selectInstagramSub,
  selectSubLoading
} from '@store/slices/subscriptionSlice'
import { SOCIAL_LINKS } from '@utils/constants'

interface InstagramState {
  subscribed: boolean
  username: string
}

export default function InstagramVerify(): JSX.Element {
  const dispatch = useDispatch()
  const instagram = useSelector(selectInstagramSub) as InstagramState
  const loading = useSelector(selectSubLoading) as boolean
  const [inputUsername, setInputUsername] = useState<string>('')

  const handleVerify = async (): Promise<void> => {
    if (!inputUsername.trim()) {
      toast.error('Введите Instagram username')
      return
    }

    const cleanUsername = inputUsername.trim().replace('@', '')
    
    try {
      const result = await dispatch(verifyInstagram({ instagramUsername: cleanUsername }))
      
      if (result.type.endsWith('/fulfilled')) {
        toast.success('Подписка подтверждена!')
        setInputUsername('')
      } else {
        toast.error(result.payload || 'Ошибка при проверке Instagram')
      }
    } catch (error) {
      toast.error('Ошибка при проверке Instagram')
    }
  }

  // Состояние: уже подтверждён
  if (instagram?.subscribed) {
    return (
      <div className="glass-card border border-success/30 p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <IoCheckmarkCircle className="text-3xl text-success" />
          <div>
            <h3 className="text-lg font-semibold text-white">Instagram подтверждён</h3>
            <p className="text-zinc-400">@{instagram.username}</p>
          </div>
        </div>
      </div>
    )
  }

  // Состояние: не подтверждён
  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      {/* Шапка */}
      <div className="text-center space-y-2">
        <IoLogoInstagram className="text-3xl text-pink-400 mx-auto" />
        <h3 className="text-lg font-semibold text-white">Подпишитесь на Instagram</h3>
        <p className="text-xs text-zinc-400">Подпишитесь на нашу страницу, затем подтвердите</p>
      </div>

      {/* Шаг 1 — Переход на страницу Instagram */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">Шаг 1:</h4>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 rounded-lg text-center text-pink-400 font-medium transition-colors"
        >
          Открыть Instagram →
        </a>
      </div>

      {/* Шаг 2 — Ввод username */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">Шаг 2:</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Instagram username (@username)"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500/50 transition-colors"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full p-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Подтверждение…' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  )
}