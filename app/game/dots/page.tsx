"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function DotsPage() {
  const router = useRouter()
  const gridSize = 10

  const [dots, setDots] = useState<Array<Array<{ color: string | null }>>>(
    Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({ color: null })),
      ),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "blue">("red")

  const handleDotClick = (row: number, col: number) => {
    if (dots[row][col].color) return

    const newDots = dots.map((r) => r.map((d) => ({ ...d })))
    newDots[row][col].color = currentPlayer
    setDots(newDots)
    setCurrentPlayer(currentPlayer === "red" ? "blue" : "red")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#f5f5dc" }}>
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push("/classic")} className="p-2 rounded-lg hover:bg-black/5 transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-700">Dots</h1>
          <div className={`w-6 h-6 rounded-full ${currentPlayer === "red" ? "bg-red-500" : "bg-blue-500"}`} />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {dots.map((row, rowIndex) =>
              row.map((dot, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleDotClick(rowIndex, colIndex)}
                  className="w-8 h-8 rounded-full border-2 border-gray-400 hover:border-gray-600 transition-all"
                  style={{
                    backgroundColor: dot.color || "transparent",
                  }}
                />
              )),
            )}
          </div>
        </div>

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
