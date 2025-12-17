"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function MathGamePage() {
  const router = useRouter()
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState("+")
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)

  const generateQuestion = () => {
    const ops = ["+", "-", "×", "÷"]
    const op = ops[Math.floor(Math.random() * ops.length)]
    setOperation(op)

    if (op === "÷") {
      const divisor = Math.floor(Math.random() * 9) + 2
      const quotient = Math.floor(Math.random() * 10) + 1
      setNum1(divisor * quotient)
      setNum2(divisor)
    } else {
      setNum1(Math.floor(Math.random() * 20) + 1)
      setNum2(Math.floor(Math.random() * 20) + 1)
    }
    setAnswer("")
  }

  const checkAnswer = () => {
    let correct = 0
    switch (operation) {
      case "+":
        correct = num1 + num2
        break
      case "-":
        correct = num1 - num2
        break
      case "×":
        correct = num1 * num2
        break
      case "÷":
        correct = num1 / num2
        break
    }

    if (Number.parseInt(answer) === correct) {
      setScore(score + 1)
      generateQuestion()
    } else {
      setAnswer("")
    }
  }

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, gameStarted])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(60)
    generateQuestion()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#4a2c2a" }}>
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
          <h1 className="text-2xl font-bold text-amber-200">Math Challenge</h1>
          <div className="text-amber-200 font-bold">Score: {score}</div>
        </div>

        {!gameStarted || timeLeft === 0 ? (
          <div className="text-center space-y-6">
            {timeLeft === 0 && <div className="text-2xl text-amber-200">Time's Up! Final Score: {score}</div>}
            <GameButton onClick={startGame} className="w-full">
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </GameButton>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-4xl text-yellow-400 font-bold mb-2">Time: {timeLeft}s</div>
            </div>

            <div className="bg-amber-900 rounded-2xl p-12 text-center">
              <div className="text-6xl font-bold text-white mb-8">
                {num1} {operation} {num2} = ?
              </div>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                className="w-full p-6 text-4xl text-center rounded-xl font-bold"
                placeholder="?"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <GameButton key={num} onClick={() => setAnswer(answer + num)}>
                  {num}
                </GameButton>
              ))}
              <GameButton onClick={() => setAnswer("")}>Clear</GameButton>
              <GameButton onClick={checkAnswer}>Submit</GameButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
