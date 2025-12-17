"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

type Tile = {
  id: number
  type: string
  rotation: number
}

export default function CarcassonnePage() {
  const router = useRouter()
  const [board, setBoard] = useState<(Tile | null)[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null)),
  )
  const [currentTile] = useState<Tile>({ id: 1, type: "road", rotation: 0 })
  const [score, setScore] = useState({ player1: 12, player2: 8 })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-700 to-green-900">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">Carcassonne</h1>
          <div className="text-white font-bold">
            P1: {score.player1} | P2: {score.player2}
          </div>
        </div>

        <div className="bg-green-800 rounded-2xl p-6 border-4 border-green-950">
          <div className="grid grid-cols-8 gap-1 bg-green-900 p-2 rounded-lg">
            {Array(8)
              .fill(0)
              .map((_, row) =>
                Array(8)
                  .fill(0)
                  .map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="aspect-square bg-green-600 rounded border border-green-700 hover:bg-green-500 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {row === 3 && col === 4 && (
                        <div className="w-full h-full bg-yellow-600 rounded flex items-center justify-center text-xs">
                          🏰
                        </div>
                      )}
                      {row === 4 && col === 3 && <div className="w-full h-full bg-amber-700 rounded" />}
                    </div>
                  )),
              )}
          </div>
        </div>

        <div className="bg-green-800 rounded-xl p-4 flex items-center justify-between">
          <div className="text-white">Current Tile:</div>
          <div className="w-20 h-20 bg-yellow-600 rounded-lg flex items-center justify-center text-2xl">🏰</div>
          <GameButton>Rotate</GameButton>
          <GameButton>Place</GameButton>
        </div>

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
