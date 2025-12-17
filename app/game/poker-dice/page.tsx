"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function PokerDicePage() {
  const router = useRouter()
  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

  const rollDice = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)

  const [dice, setDice] = useState<number[]>(rollDice())
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(2)
  const [score, setScore] = useState(0)

  const handleRoll = () => {
    if (rollsLeft === 0) return
    const newDice = dice.map((die, i) => (held[i] ? die : Math.floor(Math.random() * 6) + 1))
    setDice(newDice)
    setRollsLeft(rollsLeft - 1)
  }

  const toggleHold = (index: number) => {
    const newHeld = [...held]
    newHeld[index] = !newHeld[index]
    setHeld(newHeld)
  }

  const calculateScore = () => {
    const counts = Array(6).fill(0)
    dice.forEach((die) => counts[die - 1]++)

    let points = 0
    if (counts.includes(5))
      points = 50 // Five of a kind
    else if (counts.includes(4))
      points = 40 // Four of a kind
    else if (counts.includes(3) && counts.includes(2))
      points = 35 // Full house
    else if (counts.includes(3))
      points = 30 // Three of a kind
    else if (counts.filter((c) => c === 2).length === 2)
      points = 25 // Two pairs
    else if (counts.includes(2)) points = 20 // One pair

    // Check for straights
    const sorted = [...dice].sort()
    const isSmallStraight = [1, 2, 3, 4, 5].every((n) => sorted.includes(n))
    const isLargeStraight = [2, 3, 4, 5, 6].every((n) => sorted.includes(n))
    if (isSmallStraight || isLargeStraight) points = 45

    setScore(score + points)
    setDice(rollDice())
    setHeld([false, false, false, false, false])
    setRollsLeft(2)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#2a1a0a" }}>
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-amber-200">Poker Dice</h1>
          <div className="text-amber-200 font-bold">Score: {score}</div>
        </div>

        <div className="text-center">
          <div className="text-xl text-amber-200 font-bold">Rolls Left: {rollsLeft}</div>
        </div>

        <div className="flex justify-center gap-4">
          {dice.map((die, i) => (
            <button
              key={i}
              onClick={() => toggleHold(i)}
              className={`w-20 h-20 text-6xl rounded-xl flex items-center justify-center transition-all shadow-lg ${
                held[i] ? "bg-amber-600 scale-95" : "bg-amber-800 hover:bg-amber-700"
              }`}
            >
              <span className="text-white">{diceFaces[die - 1]}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <GameButton onClick={handleRoll} disabled={rollsLeft === 0} className="flex-1">
            Roll ({rollsLeft})
          </GameButton>
          <GameButton onClick={calculateScore} disabled={rollsLeft === 2} className="flex-1">
            Score
          </GameButton>
        </div>

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
