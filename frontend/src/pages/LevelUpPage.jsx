// LevelUpPage.jsx — SUHROB
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { xp, newLevel, justLeveledUp, quizResult, dismissLevelUp } = useUserStats()

  useEffect(() => {
    if (!justLeveledUp) navigate('/leaderboard', { replace: true })
  }, [justLeveledUp, navigate])

  const handleClose = () => {
    dismissLevelUp()
    navigate('/courses')
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
