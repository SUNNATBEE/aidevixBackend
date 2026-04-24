'use client';

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStats } from '@hooks/useUserStats'
import LevelUpModal from '@components/leaderboard/LevelUpModal'
import { useLang } from '@/context/LangContext'

export default function LevelUpPage() {
  const { t } = useLang()
  const getLevelName = useCallback((lvl: number) => {
    if (!lvl) return t('lb.level.1')
    const keys = [50, 40, 35, 30, 25, 20, 15, 10, 5, 1]
    const found = keys.find((k) => lvl >= k)
    return found ? t(`lb.level.${found}`) : t('lb.level.1')
  }, [t])
  const router = useRouter()
  const { xp, newLevel, justLeveledUp, quizResult, dismissLevelUp } = useUserStats()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !justLeveledUp) {
      router.replace('/leaderboard')
    }
  }, [justLeveledUp, router, isMounted])

  if (!isMounted) return null

  const handleClose = () => {
    dismissLevelUp()
    router.push('/courses')
  }

  return (
    <LevelUpModal
      isOpen={justLeveledUp}
      level={newLevel}
      levelName={getLevelName(newLevel)}
      xp={xp}
      quizResult={quizResult}
      onClose={handleClose}
    />
  )
}
