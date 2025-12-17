"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function BullsCowsPage() {
  const router = useRouter()
  const [secret] = useState(() => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = digits.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4).join("")
  })
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<Array<{ guess: string; bulls: number; cows: number }>>([])

  const checkGuess = () => {
    if (currentGuess.length !== 4) return

    let bulls = 0
    let cows = 0

    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === secret[i]) {
        bulls++
      } else if (secret.includes(currentGuess[i])) {
        cows++
      }
    }

    setGuesses([...guesses, { guess: currentGuess, bulls, cows }])
    setCurrentGuess("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-700 to-orange-800">
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
          <h1 className="text-2xl font-bold text-white">Bulls and Cows</h1>
          <div className="w-10" />
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-8 border-8 border-amber-950 shadow-2xl">
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {guesses.map((g, i) => (
              <div key={i} className="flex items-center justify-between bg-amber-900 rounded-xl p-4">
                <div className="flex gap-2">
                  {g.guess.split("").map((digit, j) => (
                    <div
                      key={j}
                      className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl font-bold"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                <div className="text-white font-bold text-xl">
                  🐂 {g.bulls} | 🐄 {g.cows}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-center mb-4">
            {currentGuess.split("").map((digit, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl font-bold"
              >
                {digit}
              </div>
            ))}
            {Array(4 - currentGuess.length)
              .fill(0)
              .map((_, i) => (
                <div key={`empty-${i}`} className="w-16 h-16 bg-amber-900 rounded-xl border-2 border-amber-700" />
              ))}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (currentGuess.length < 4) {
                    setCurrentGuess(currentGuess + num)
                  }
                }}
                className="py-4 bg-amber-700 hover:bg-amber-600 text-white text-2xl font-bold rounded-xl transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <GameButton onClick={() => setCurrentGuess("")} variant="secondary" className="flex-1">
            Clear
          </GameButton>
          <GameButton onClick={checkGuess} className="flex-1">
            Check
          </GameButton>
        </div>

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
