'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStats } from '@hooks/useUserStats'
import LevelUpModal from '@components/leaderboard/LevelUpModal'

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}

const getLevelName = (lvl: number) => {
  if (!lvl) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  const found = keys.find((k) => lvl >= k)
  return found ? LEVEL_NAMES[found as keyof typeof LEVEL_NAMES] : 'Yangi Boshlovchi'
}

export default function LevelUpPage() {
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
