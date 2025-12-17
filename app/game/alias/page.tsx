"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

const WORDS = [
  "Computer",
  "Elephant",
  "Rainbow",
  "Guitar",
  "Mountain",
  "Ocean",
  "Bicycle",
  "Pizza",
  "Telephone",
  "Butterfly",
  "Football",
  "Chocolate",
  "Universe",
  "Rocket",
  "Diamond",
]

export default function AliasPage() {
  const router = useRouter()
  const [currentWord, setCurrentWord] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [usedWords, setUsedWords] = useState<string[]>([])

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsPlaying(false)
    }
  }, [timeLeft, isPlaying])

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(60)
    setUsedWords([])
    nextWord()
  }

  const nextWord = () => {
    const availableWords = WORDS.filter((w) => !usedWords.includes(w))
    if (availableWords.length === 0) {
      setUsedWords([])
      setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)])
    } else {
      const word = availableWords[Math.floor(Math.random() * availableWords.length)]
      setCurrentWord(word)
      setUsedWords([...usedWords, word])
    }
  }

  const correct = () => {
    setScore(score + 1)
    nextWord()
  }

  const skip = () => {
    nextWord()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900">
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
          <h1 className="text-3xl font-bold text-white">Алиас</h1>
          <div className="w-10" />
        </div>

        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-8 border-8 border-amber-950 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-amber-200 text-xl font-bold">Score: {score}</div>
            <div className="text-6xl font-bold text-white">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </div>

            {isPlaying ? (
              <div className="bg-white rounded-2xl p-8 min-h-32 flex items-center justify-center">
                <div className="text-5xl font-bold text-gray-800">{currentWord}</div>
              </div>
            ) : (
              <div className="bg-white/20 rounded-2xl p-8 min-h-32 flex items-center justify-center">
                <div className="text-2xl text-white">Ready to play?</div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-4xl">🎲</div>
              </div>
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-4xl">🎲</div>
              </div>
            </div>
          </div>
        </div>

        {isPlaying ? (
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
            Start Game
          </GameButton>
        )}

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
