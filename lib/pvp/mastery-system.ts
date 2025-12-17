// New mastery ranking system with 3D progression
export interface MasteryRank {
  level: number // 1-10
  subRank: number // 1-3 (базовый, продвинутый, профессиональный)
  fragments: number // 0-5
}

export const MASTERY_LEVELS = [
  {
    id: 1,
    nameEn: "Novice",
    nameRu: "Новичок",
    color: "#8B4513",
    icon: "🧩",
  },
  {
    id: 2,
    nameEn: "Student",
    nameRu: "Ученик",
    color: "#CD853F",
    icon: "📚",
  },
  {
    id: 3,
    nameEn: "Thinker",
    nameRu: "Мыслитель",
    color: "#DAA520",
    icon: "🧠",
  },
  {
    id: 4,
    nameEn: "Analyst",
    nameRu: "Аналитик",
    color: "#4682B4",
    icon: "🔍",
  },
  {
    id: 5,
    nameEn: "Strategist",
    nameRu: "Стратег",
    color: "#9370DB",
    icon: "♟️",
  },
  {
    id: 6,
    nameEn: "Tactician",
    nameRu: "Тактик",
    color: "#20B2AA",
    icon: "🎯",
  },
  {
    id: 7,
    nameEn: "Logician",
    nameRu: "Логик",
    color: "#FF6347",
    icon: "⚡",
  },
  {
    id: 8,
    nameEn: "Intellectual",
    nameRu: "Интеллектуал",
    color: "#FF1493",
    icon: "💎",
  },
  {
    id: 9,
    nameEn: "Master of Mind",
    nameRu: "Мастер разума",
    color: "#FFD700",
    icon: "👑",
  },
  {
    id: 10,
    nameEn: "Grandmaster",
    nameRu: "Гроссмейстер",
    color: "#FF00FF",
    icon: "⭐",
  },
] as const

export const SUB_RANK_NAMES = {
  1: { en: "Basic", ru: "базовый" },
  2: { en: "Advanced", ru: "продвинутый" },
  3: { en: "Professional", ru: "профессиональный" },
} as const

export function calculateMasteryProgress(rank: MasteryRank, won: boolean): MasteryRank {
  const newRank = { ...rank }

  if (won) {
    // Add a fragment
    newRank.fragments++

    // Check if we completed the sub-rank (5 fragments)
    if (newRank.fragments >= 5) {
      newRank.fragments = 0
      newRank.subRank++

      // Check if we completed all sub-ranks (3 sub-ranks)
      if (newRank.subRank > 3) {
        newRank.subRank = 1
        newRank.level = Math.min(10, newRank.level + 1)
      }
    }
  } else {
    // Lose a fragment on loss
    if (newRank.fragments > 0) {
      newRank.fragments--
    } else {
      // If no fragments, go back a sub-rank
      if (newRank.subRank > 1) {
        newRank.subRank--
        newRank.fragments = 4
      } else if (newRank.level > 1) {
        newRank.level--
        newRank.subRank = 3
        newRank.fragments = 4
      }
    }
  }

  return newRank
}

export function getMasteryDisplay(rank: MasteryRank, language: "en" | "ru" = "ru"): string {
  const level = MASTERY_LEVELS.find((l) => l.id === rank.level)
  const subRank = SUB_RANK_NAMES[rank.subRank as keyof typeof SUB_RANK_NAMES]

  if (!level || !subRank) return "Unknown"

  const levelName = language === "ru" ? level.nameRu : level.nameEn
  const subRankName = language === "ru" ? subRank.ru : subRank.en

  return `${levelName} — ${subRankName}`
}
