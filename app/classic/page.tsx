"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameIcon } from "@/components/game-icon"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { games } from "@/lib/games/game-definitions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DifficultyLevel } from "@/lib/ai/difficulty-levels"

export default function ClassicGamesPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false)

  const classicGames = games.filter((game) => game.category === "classic")

  const handleGameClick = (game: any) => {
    if (!game.implemented) return

    setSelectedGame(game.route)
    setShowDifficultyDialog(true)
  }

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    if (selectedGame) {
      router.push(`${selectedGame}?difficulty=${difficulty}&mode=ai`)
    }
    setShowDifficultyDialog(false)
  }

  return (
    <div className="min-h-screen p-4 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            <svg className="w-6 h-6 text-[#d4b896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("classicGames")}</h1>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {classicGames.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameClick(game)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                game.implemented
                  ? "bg-[#2a2a2a] hover:bg-[#353535] cursor-pointer"
                  : "bg-[#2a2a2a] opacity-50 cursor-not-allowed"
              }`}
              disabled={!game.implemented}
            >
              <GameIcon icon={game.icon} name={t(game.nameKey as any)} size="md" />
              <span className="text-sm text-center text-[#d4b896] font-medium">{t(game.nameKey as any)}</span>
              {!game.implemented && <span className="text-xs text-[#a89070]">Coming Soon</span>}
            </button>
          ))}
        </div>

        {/* Difficulty Selection Dialog */}
        <Dialog open={showDifficultyDialog} onOpenChange={setShowDifficultyDialog}>
          <DialogContent className="bg-[#2a2a2a] border-[#c9a870]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#d4b896] text-center">Select Difficulty</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              <GameButton onClick={() => handleDifficultySelect("easy")} className="w-full">
                Easy - Relaxed Play
              </GameButton>
              <GameButton onClick={() => handleDifficultySelect("medium")} variant="secondary" className="w-full">
                Medium - Balanced
              </GameButton>
              <GameButton onClick={() => handleDifficultySelect("hard")} variant="secondary" className="w-full">
                Hard - Challenging
              </GameButton>
              <GameButton onClick={() => handleDifficultySelect("expert")} variant="secondary" className="w-full">
                Expert - Master Level
              </GameButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
