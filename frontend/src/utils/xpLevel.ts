export const RANKS = [
  { title: 'AMATEUR', minXp: 0 },
  { title: 'CANDIDATE', minXp: 500 },
  { title: 'JUNIOR', minXp: 2000 },
  { title: 'MIDDLE', minXp: 5000 },
  { title: 'SENIOR', minXp: 10000 },
  { title: 'MASTER', minXp: 20000 },
  { title: 'LEGEND', minXp: 50000 },
];

export const getRankInfo = (xp: number = 0) => {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || RANKS[i]; // If Legend, next rank is still Legend
    } else {
      break;
    }
  }

  const isMaxRank = currentRank.title === 'LEGEND';
  
  let progressPercentage = 100;
  let xpNeeded = 0;

  if (!isMaxRank && nextRank) {
    const xpInCurrentLevel = xp - currentRank.minXp;
    const requiredXpForNext = nextRank.minXp - currentRank.minXp;
    progressPercentage = (xpInCurrentLevel / requiredXpForNext) * 100;
    progressPercentage = Math.max(0, Math.min(100, progressPercentage));
    xpNeeded = nextRank.minXp - xp;
  }

  return {
    currentRank,
    nextRank,
    progressPercentage,
    xpNeeded,
    isMaxRank
  };
};
