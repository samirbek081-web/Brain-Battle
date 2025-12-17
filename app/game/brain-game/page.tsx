"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function BrainGamePage() {
  const router = useRouter()
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f"]

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true)
    for (const button of seq) {
      setActiveButton(button)
      await new Promise((resolve) => setTimeout(resolve, 600))
      setActiveButton(null)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    setIsPlaying(false)
  }

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)]
    setSequence(newSequence)
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    playSequence(newSequence)
  }

  const handleButtonClick = (button: number) => {
    if (isPlaying || gameOver) return

    const newPlayerSequence = [...playerSequence, button]
    setPlayerSequence(newPlayerSequence)

    if (sequence[newPlayerSequence.length - 1] !== button) {
      setGameOver(true)
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1
      setScore(newScore)
      const newSequence = [...sequence, Math.floor(Math.random() * 4)]
      setSequence(newSequence)
      setPlayerSequence([])
      setTimeout(() => playSequence(newSequence), 1000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">Brain Game</h1>
          <div className="text-white font-bold">Score: {score}</div>
        </div>

        {gameOver && <div className="text-center text-red-500 text-2xl font-bold">Game Over! Final Score: {score}</div>}

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => handleButtonClick(i)}
              disabled={isPlaying}
              className={`aspect-square rounded-2xl transition-all shadow-lg ${
                activeButton === i ? "scale-95 brightness-150" : "hover:scale-105"
              }`}
              style={{ backgroundColor: colors[i], opacity: isPlaying && activeButton !== i ? 0.3 : 1 }}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <GameButton onClick={startGame} className="flex-1">
            {sequence.length === 0 ? "Start Game" : "New Game"}
          </GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
