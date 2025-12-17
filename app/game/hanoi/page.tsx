"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

type Tower = number[]

export default function HanoiPage() {
  const router = useRouter()
  const numDisks = 4

  const [towers, setTowers] = useState<Tower[]>([Array.from({ length: numDisks }, (_, i) => numDisks - i), [], []])
  const [selectedTower, setSelectedTower] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)

  const handleTowerClick = (towerIndex: number) => {
    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex)
      }
    } else {
      if (selectedTower === towerIndex) {
        setSelectedTower(null)
        return
      }

      const fromTower = towers[selectedTower]
      const toTower = towers[towerIndex]
      const disk = fromTower[fromTower.length - 1]

      if (toTower.length === 0 || disk < toTower[toTower.length - 1]) {
        const newTowers = towers.map((t) => [...t])
        newTowers[selectedTower] = fromTower.slice(0, -1)
        newTowers[towerIndex] = [...toTower, disk]
        setTowers(newTowers)
        setMoves(moves + 1)

        if (newTowers[2].length === numDisks) {
          setTimeout(() => alert(`Congratulations! Solved in ${moves + 1} moves! 🎉`), 100)
        }
      }

      setSelectedTower(null)
    }
  }

  const reset = () => {
    setTowers([Array.from({ length: numDisks }, (_, i) => numDisks - i), [], []])
    setSelectedTower(null)
    setMoves(0)
  }

  const getDiskColor = (size: number) => {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"]
    return colors[size - 1]
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#6b4423" }}>
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-amber-200">Tower of Hanoi</h1>
          <div className="text-amber-200 font-bold">Moves: {moves}</div>
        </div>

        <div className="bg-amber-900 rounded-2xl p-8">
          <div className="grid grid-cols-3 gap-8">
            {towers.map((tower, towerIndex) => (
              <button
                key={towerIndex}
                onClick={() => handleTowerClick(towerIndex)}
                className={`flex flex-col items-center justify-end h-64 relative ${
                  selectedTower === towerIndex ? "ring-4 ring-yellow-400" : ""
                } rounded-lg transition-all`}
              >
                <div className="absolute bottom-0 w-2 h-full bg-amber-800 rounded-t"></div>
                <div className="absolute bottom-0 w-full h-3 bg-amber-800 rounded"></div>
                <div className="flex flex-col items-center justify-end space-y-1 relative z-10 pb-4">
                  {tower.map((disk, diskIndex) => (
                    <div
                      key={diskIndex}
                      className="h-6 rounded shadow-lg"
                      style={{
                        width: `${disk * 25}%`,
                        backgroundColor: getDiskColor(disk),
                      }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <GameButton onClick={reset} className="flex-1">
            Reset
          </GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
