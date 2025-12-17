"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

const CHARADES = [
  { word: "Swimming", category: "Sport" },
  { word: "Elephant", category: "Animal" },
  { word: "Chef", category: "Profession" },
  { word: "Guitar", category: "Music" },
  { word: "Dancing", category: "Activity" },
  { word: "Airplane", category: "Transport" },
  { word: "Doctor", category: "Profession" },
  { word: "Basketball", category: "Sport" },
]

const SPEEDS = [30, 45, 60, 90]

export default function CharadesPage() {
  const router = useRouter()
  const [selectedSpeed, setSelectedSpeed] = useState(60)
  const [currentCharade, setCurrentCharade] = useState(CHARADES[0])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(selectedSpeed)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSetup, setShowSetup] = useState(true)

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsPlaying(false)
    }
  }, [timeLeft, isPlaying])

  const startGame = () => {
    setShowSetup(false)
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(selectedSpeed)
    nextCharade()
  }

  const nextCharade = () => {
    const newCharade = CHARADES[Math.floor(Math.random() * CHARADES.length)]
    setCurrentCharade(newCharade)
  }

  const correct = () => {
    setScore(score + 1)
    nextCharade()
  }

  const skip = () => {
    nextCharade()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-800 to-orange-900">
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
          <h1 className="text-3xl font-bold text-white">Charades</h1>
          <div className="w-10" />
        </div>

        {showSetup ? (
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-8 border-8 border-amber-950 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-2xl font-bold text-white mb-4">Select Speed</div>
              <div className="grid grid-cols-2 gap-4">
                {SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSelectedSpeed(speed)}
                    className={`py-6 px-8 rounded-xl text-3xl font-bold transition-all ${
                      selectedSpeed === speed
                        ? "bg-white text-amber-900 scale-105"
                        : "bg-amber-700 text-white hover:bg-amber-600"
                    }`}
                  >
                    {speed}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-8 border-8 border-amber-950 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-amber-200 text-xl font-bold">Score: {score}</div>
              <div className="text-6xl font-bold text-white">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
              </div>

              {isPlaying && (
                <>
                  <div className="bg-white rounded-2xl p-8 min-h-32 flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-600 mb-2">{currentCharade.category}</div>
                    <div className="text-5xl font-bold text-gray-800">{currentCharade.word}</div>
                  </div>
                  <div className="text-white text-lg">Act it out without speaking!</div>
                </>
              )}
            </div>
          </div>
        )}

        {showSetup ? (
          <GameButton onClick={startGame} className="w-full">
            Start Game
          </GameButton>
        ) : isPlaying ? (
          <div className="flex gap-4">
            <GameButton onClick={skip} variant="secondary" className="flex-1">
              Skip
            </GameButton>
            <GameButton onClick={correct} className="flex-1">
              Correct
            </GameButton>
          </div>
        ) : (
          <GameButton onClick={startGame} className="w-full">
            Play Again
          </GameButton>
        )}

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
