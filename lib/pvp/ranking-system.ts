export interface PlayerRank {
  userId: string
  rank: number // 1-10
  stage: number // 1-10
  totalWins: number
  totalLosses: number
  currentStreak: number
}

export interface MatchResult {
  winnerId: string
  loserId: string
  gameId: string
  timestamp: number
}

export const RANKS = [
  { id: 1, name: "Bronze", color: "#cd7f32" },
  { id: 2, name: "Silver", color: "#c0c0c0" },
  { id: 3, name: "Gold", color: "#ffd700" },
  { id: 4, name: "Platinum", color: "#e5e4e2" },
  { id: 5, name: "Diamond", color: "#b9f2ff" },
  { id: 6, name: "Master", color: "#9966ff" },
  { id: 7, name: "Grandmaster", color: "#ff6600" },
  { id: 8, name: "Champion", color: "#ff0000" },
  { id: 9, name: "Legend", color: "#ff00ff" },
  { id: 10, name: "Mythic", color: "#ffaa00" },
]

export function calculateRankChange(currentRank: PlayerRank, won: boolean): PlayerRank {
  const newRank = { ...currentRank }

  if (won) {
    newRank.totalWins++
    newRank.currentStreak++

    if (newRank.stage < 10) {
      newRank.stage++
    } else if (newRank.rank < 10) {
      newRank.rank++
      newRank.stage = 1
    }
  } else {
    newRank.totalLosses++
    newRank.currentStreak = 0

    if (newRank.stage > 1) {
      newRank.stage--
    } else if (newRank.rank > 1) {
      newRank.rank--
      newRank.stage = 10
    }
  }

  return newRank
}

export function getRankDisplay(rank: PlayerRank): string {
  const rankInfo = RANKS.find((r) => r.id === rank.rank)
  return `${rankInfo?.name || "Unknown"} ${rank.stage}/10`
}
