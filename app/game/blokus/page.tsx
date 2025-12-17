"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function BlokusPage() {
  const router = useRouter()
  const [board, setBoard] = useState<string[][]>(
    Array(20)
      .fill(null)
      .map(() => Array(20).fill("")),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "blue" | "yellow" | "green">("red")

  const getPlayerColor = (player: string) => {
    const colors = {
      red: "#e74c3c",
      blue: "#3498db",
      yellow: "#f1c40f",
      green: "#2ecc71",
    }
    return colors[player as keyof typeof colors] || "#ccc"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900">
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
          <h1 className="text-2xl font-bold text-white">Blokus</h1>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: getPlayerColor(currentPlayer) }} />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 border-4 border-gray-800">
          <div className="grid grid-cols-14 gap-px bg-gray-700 p-1 rounded-lg">
            {Array(14)
              .fill(0)
              .map((_, row) =>
                Array(14)
                  .fill(0)
                  .map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="aspect-square bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: board[row]?.[col] ? getPlayerColor(board[row][col]) : undefined,
                      }}
                    />
                  )),
              )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex gap-3 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((piece) => (
              <button
                key={piece}
                className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-gray-600 hover:border-white transition-colors"
                style={{ backgroundColor: getPlayerColor(currentPlayer) }}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold">P{piece}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <GameButton className="flex-1">Rotate</GameButton>
          <GameButton className="flex-1">Flip</GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
