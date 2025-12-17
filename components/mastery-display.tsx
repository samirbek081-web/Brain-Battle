"use client"

import { MASTERY_LEVELS, SUB_RANK_NAMES, type MasteryRank } from "@/lib/pvp/mastery-system"
import { useTranslation } from "@/lib/i18n/use-translation"

interface MasteryDisplayProps {
  rank: MasteryRank
  showFragments?: boolean
}

export function MasteryDisplay({ rank, showFragments = true }: MasteryDisplayProps) {
  const { t, language } = useTranslation()
  const level = MASTERY_LEVELS.find((l) => l.id === rank.level)
  const subRank = SUB_RANK_NAMES[rank.subRank as keyof typeof SUB_RANK_NAMES]

  if (!level || !subRank) return null

  const levelName = language === "ru" ? level.nameRu : level.nameEn
  const subRankName = language === "ru" ? subRank.ru : subRank.en

  return (
    <div className="space-y-4">
      {/* Level Display */}
      <div className="text-center">
        <div className="text-6xl mb-2">{level.icon}</div>
        <div className="text-3xl font-bold mb-1" style={{ color: level.color }}>
          {levelName}
        </div>
        <div className="text-lg text-[#a89070]">{subRankName}</div>
      </div>

      {/* Fragment Progress */}
      {showFragments && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#a89070]">
            <span>{t("masteryFragments")}</span>
            <span>{rank.fragments}/5</span>
          </div>
          <div className="flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: i < rank.fragments ? level.color : "#2a2a2a",
                  boxShadow: i < rank.fragments ? `0 0 20px ${level.color}80` : "none",
                  transform: i < rank.fragments ? "scale(1.1)" : "scale(1)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {i < rank.fragments ? "💎" : "◇"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-rank Progress */}
      <div className="space-y-2">
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((subRankNum) => {
            const subRankInfo = SUB_RANK_NAMES[subRankNum as keyof typeof SUB_RANK_NAMES]
            const subRankName = language === "ru" ? subRankInfo.ru : subRankInfo.en
            return (
              <div
                key={subRankNum}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  rank.subRank === subRankNum ? "font-bold" : rank.subRank > subRankNum ? "opacity-60" : "opacity-30"
                }`}
                style={{
                  backgroundColor: rank.subRank >= subRankNum ? level.color : "#2a2a2a",
                  color: rank.subRank >= subRankNum ? "#1a1a1a" : "#a89070",
                }}
              >
                {subRankName}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
