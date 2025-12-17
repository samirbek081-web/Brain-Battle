"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

const WORDS = [
  { word: "LISTEN", anagram: "SILENT" },
  { word: "TRIANGLE", anagram: "INTEGRAL" },
  { word: "CINEMA", anagram: "ICEMAN" },
  { word: "EARTH", anagram: "HEART" },
  { word: "NIGHT", anagram: "THING" },
]

const SPEEDS = [30, 45, 60, 90]

export default function AnagramsPage() {
  const router = useRouter()
  const [selectedSpeed, setSelectedSpeed] = useState(60)
  const [currentWord, setCurrentWord] = useState(WORDS[0])
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(selectedSpeed)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSetup, setShowSetup] = useState(true)
  const [feedback, setFeedback] = useState("")

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
    nextWord()
  }

  const nextWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(newWord)
    setUserAnswer("")
    setFeedback("")
  }

  const checkAnswer = () => {
    if (userAnswer.toUpperCase() === currentWord.anagram) {
      setScore(score + 1)
      setFeedback("Correct!")
      setTimeout(() => nextWord(), 1000)
    } else {
      setFeedback("Try again!")
    }
  }

  const shuffleLetters = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
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
          <h1 className="text-3xl font-bold text-white">Anagrams</h1>
          <div className="w-10" />
        </div>

        {showSetup ? (
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-8 border-8 border-amber-950 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-2xl font-bold text-white mb-4">Select Time</div>
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
              <div className="flex justify-between text-white text-xl font-bold">
                <div>Score: {score}</div>
                <div>{timeLeft}s</div>
              </div>

              {isPlaying && (
                <>
                  <div className="flex gap-2 justify-center mb-4">
                    {shuffleLetters(currentWord.word)
                      .split("")
                      .map((letter, i) => (
                        <div key={i} className="w-14 h-14 bg-amber-900 rounded-lg flex items-center justify-center">
                          <div className="text-3xl font-bold text-amber-200">{letter}</div>
                        </div>
                      ))}
                  </div>

                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                    className="w-full px-6 py-4 text-2xl text-center font-bold bg-white rounded-xl"
                    placeholder="Your answer..."
                  />

                  {feedback && (
                    <div
                      className={`text-2xl font-bold ${feedback === "Correct!" ? "text-green-300" : "text-red-300"}`}
                    >
                      {feedback}
                    </div>
                  )}
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
            <GameButton onClick={nextWord} variant="secondary" className="flex-1">
              Skip
            </GameButton>
            <GameButton onClick={checkAnswer} className="flex-1">
              Check
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
