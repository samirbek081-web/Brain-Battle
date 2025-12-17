"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

const QUESTIONS = [
  {
    question: "Who started World War II?",
    options: ["Adolf Hitler", "Winston Churchill", "Joseph Stalin", "Napoleon"],
    correct: 0,
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correct: 2,
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    if (index === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1)
    }
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-orange-900">
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
          <h1 className="text-3xl font-bold text-white">20 Questions</h1>
          <div className="w-10" />
        </div>

        {!showResult ? (
          <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-3xl p-8 border-8 border-red-950 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-white mb-4">20</div>
              <div className="text-xl text-red-200">ВОПРОСОВ</div>

              <div className="bg-black/30 rounded-2xl p-6 min-h-32 flex items-center justify-center">
                <div className="text-2xl text-white font-bold">{QUESTIONS[currentQuestion].question}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {QUESTIONS[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                      selectedAnswer === index
                        ? index === QUESTIONS[currentQuestion].correct
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-red-700 text-white hover:bg-red-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="text-red-200 text-lg">
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-3xl p-8 border-8 border-red-950 shadow-2xl text-center">
            <div className="text-6xl font-bold text-white mb-4">{score}</div>
            <div className="text-2xl text-red-200">Correct Answers out of {QUESTIONS.length}</div>
            <GameButton
              onClick={() => {
                setCurrentQuestion(0)
                setScore(0)
                setSelectedAnswer(null)
                setShowResult(false)
              }}
              className="mt-6"
            >
              Play Again
            </GameButton>
          </div>
        )}

        <GameButton onClick={() => router.push("/classic")} variant="secondary" className="w-full">
          Quit
        </GameButton>
      </div>
    </div>
  )
}
