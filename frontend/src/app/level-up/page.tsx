'use client';

// LevelUpPage.jsx — SUHROB
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStats } from '@hooks/useUserStats'
import LevelUpModal from '@components/leaderboard/LevelUpModal'

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (lvl) => {
  if (!lvl) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  return LEVEL_NAMES[keys.find((k) => lvl >= k)] || 'Yangi Boshlovchi'
}

export default function LevelUpPage() {
  const router = useRouter()
  const { xp, newLevel, justLeveledUp, quizResult, dismissLevelUp } = useUserStats()

  useEffect(() => {
    if (!justLeveledUp) router.replace('/leaderboard')
  }, [justLeveledUp, router])

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
