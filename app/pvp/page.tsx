"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { MasteryDisplay } from "@/components/mastery-display"
import { MASTERY_LEVELS, type MasteryRank } from "@/lib/pvp/mastery-system"

export default function PvPPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [user, setUser] = useState<any>(null)
  const [masteryRank, setMasteryRank] = useState<MasteryRank>({
    level: 1,
    subRank: 1,
    fragments: 0,
  })
  const [stats, setStats] = useState({ wins: 0, losses: 0, streak: 0 })
  const [isSearching, setIsSearching] = useState(false)
  const [searchTime, setSearchTime] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1)
      }, 1000)
    } else {
      setSearchTime(0)
    }
    return () => clearInterval(interval)
  }, [isSearching])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Load mastery rank
      const { data: rankData } = await supabase.from("mastery_ranks").select("*").eq("user_id", user.id).single()

      if (rankData) {
        setMasteryRank({
          level: rankData.rank_level,
          subRank: rankData.sub_rank,
          fragments: rankData.fragments,
        })
        setStats({
          wins: rankData.total_wins,
          losses: rankData.total_losses,
          streak: rankData.current_streak,
        })
      } else {
        // Create initial rank
        await supabase
          .from("mastery_ranks")
          .insert({
            user_id: user.id,
            rank_level: 1,
            sub_rank: 1,
            fragments: 0,
          })
          .select()
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayClick = () => {
    setIsSearching(true)

    // Simulate matchmaking
    setTimeout(() => {
      setIsSearching(false)
      router.push("/game/chess?mode=pvp")
    }, 3000)
  }

  const cancelSearch = () => {
    setIsSearching(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="animate-spin w-16 h-16 border-4 border-[#d4b896] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-[#1a1a1a]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            <svg className="w-6 h-6 text-[#d4b896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("mastery")}</h1>
        </div>

        {/* Mastery Display */}
        <div className="mb-8 bg-[#2a2a2a] rounded-2xl p-6">
          <MasteryDisplay rank={masteryRank} showFragments={true} />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#3a3a3a]">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#d4b896]">{stats.wins}</div>
              <div className="text-sm text-[#a89070]">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#a89070]">{stats.losses}</div>
              <div className="text-sm text-[#a89070]">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c9a870]">{stats.streak}</div>
              <div className="text-sm text-[#a89070]">Streak</div>
            </div>
          </div>
        </div>

        {/* Matchmaking */}
        {!isSearching ? (
          <div className="space-y-4">
            <GameButton onClick={handlePlayClick} className="w-full">
              {t("play")}
            </GameButton>
            <div className="text-center text-sm text-[#a89070]">Find a random opponent and play a random game!</div>
          </div>
        ) : (
          <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center space-y-4">
            <div className="animate-spin w-16 h-16 border-4 border-[#d4b896] border-t-transparent rounded-full mx-auto" />
            <div className="text-xl font-bold text-[#d4b896]">Searching for opponent...</div>
            <div className="text-[#a89070]">{searchTime}s</div>
            <GameButton onClick={cancelSearch} variant="secondary" className="mt-4">
              Cancel
            </GameButton>
          </div>
        )}

        {/* Mastery Ladder */}
        <div className="mt-8 bg-[#2a2a2a] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#d4b896] mb-4">Mastery Levels</h2>
          <div className="space-y-2">
            {MASTERY_LEVELS.slice()
              .reverse()
              .map((level) => (
                <div
                  key={level.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    level.id === masteryRank.level ? "bg-[#1a1a1a]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{level.icon}</div>
                    <div>
                      <div className="font-medium" style={{ color: level.color }}>
                        {level.nameRu}
                      </div>
                      <div className="text-xs text-[#a89070]">{level.nameEn}</div>
                    </div>
                  </div>
                  {level.id === masteryRank.level && (
                    <div className="text-sm text-[#a89070]">
                      {masteryRank.fragments}/5 • {masteryRank.subRank}/3
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
