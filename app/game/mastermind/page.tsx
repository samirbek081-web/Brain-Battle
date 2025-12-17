"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function MastermindPage() {
  const router = useRouter()
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"]
  const [secret] = useState([
    colors[Math.floor(Math.random() * colors.length)],
    colors[Math.floor(Math.random() * colors.length)],
    colors[Math.floor(Math.random() * colors.length)],
    colors[Math.floor(Math.random() * colors.length)],
  ])
  const [currentGuess, setCurrentGuess] = useState<string[]>(["", "", "", ""])
  const [guesses, setGuesses] = useState<Array<{ guess: string[]; result: { black: number; white: number } }>>([])

  const checkGuess = () => {
    if (currentGuess.some((c) => !c)) return

    let black = 0
    let white = 0
    const secretCopy = [...secret]
    const guessCopy = [...currentGuess]

    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        black++
        secretCopy[i] = ""
        guessCopy[i] = ""
      }
    }

    for (let i = 0; i < 4; i++) {
      if (guessCopy[i]) {
        const index = secretCopy.indexOf(guessCopy[i])
        if (index !== -1) {
          white++
          secretCopy[index] = ""
        }
      }
    }

    setGuesses([...guesses, { guess: currentGuess, result: { black, white } }])
    setCurrentGuess(["", "", "", ""])
  }

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "#e74c3c",
      blue: "#3498db",
      green: "#2ecc71",
      yellow: "#f1c40f",
      purple: "#9b59b6",
      orange: "#e67e22",
    }
    return colorMap[color]
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#2c3e50" }}>
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
          <h1 className="text-2xl font-bold text-white">Mastermind</h1>
          <div className="w-10" />
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="space-y-3">
            {guesses.map((g, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex gap-2">
                  {g.guess.map((color, j) => (
                    <div
                      key={j}
                      className="w-12 h-12 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: getColorStyle(color) }}
                    />
                  ))}
                </div>
                <div className="text-white">
                  {g.result.black}⚫ {g.result.white}⚪
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {currentGuess.map((color, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-full border-4 border-white"
              style={{ backgroundColor: color ? getColorStyle(color) : "#555" }}
            />
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                const emptyIndex = currentGuess.findIndex((c) => !c)
                if (emptyIndex !== -1) {
                  const newGuess = [...currentGuess]
                  newGuess[emptyIndex] = color
                  setCurrentGuess(newGuess)
                }
              }}
              className="w-12 h-12 rounded-full border-2 border-white hover:scale-110 transition-transform"
              style={{ backgroundColor: getColorStyle(color) }}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <GameButton onClick={checkGuess} className="flex-1">
            Check
          </GameButton>
          <GameButton onClick={() => setCurrentGuess(["", "", "", ""])} variant="secondary" className="flex-1">
            Clear
          </GameButton>
        </div>
      </div>
    </div>
  )
}
