"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function BackgammonPage() {
  const router = useRouter()
  const [dice, setDice] = useState<[number, number]>([1, 1])
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")

  const rollDice = () => {
    const newDice: [number, number] = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
    setDice(newDice)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#4a3426" }}>
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-black/20 transition-colors"
          >
            <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-amber-200">Backgammon</h1>
          <div className="w-10" />
        </div>

        <div className="bg-amber-900 p-6 rounded-2xl border-4 border-amber-700">
          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-video bg-amber-800 rounded-xl p-4 flex items-center justify-center">
              <div className="grid grid-cols-6 gap-2 w-full">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-16 bg-amber-950 rounded-t-full" />
                      <div className="flex flex-col gap-1 items-center">
                        {i % 2 === 0 && (
                          <>
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-700" />
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-700" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="aspect-video bg-amber-800 rounded-xl p-4 flex items-center justify-center">
              <div className="grid grid-cols-6 gap-2 w-full">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-16 bg-amber-950 rounded-t-full" />
                      <div className="flex flex-col gap-1 items-center">
                        {i % 2 === 1 && (
                          <>
                            <div className="w-8 h-8 rounded-full bg-black border-2 border-amber-700" />
                            <div className="w-8 h-8 rounded-full bg-black border-2 border-amber-700" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold shadow-lg">
              {dice[0]}
            </div>
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold shadow-lg">
              {dice[1]}
            </div>
          </div>
          <GameButton onClick={rollDice}>Roll Dice</GameButton>
        </div>

        <div className="flex gap-4">
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
