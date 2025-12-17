"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

export default function TwentyQuestionsPage() {
  const router = useRouter()
  const [questionsLeft, setQuestionsLeft] = useState(20)
  const [answer, setAnswer] = useState("")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-orange-800">
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
          <h1 className="text-2xl font-bold text-white">20 Questions</h1>
          <div className="w-10" />
        </div>

        <div className="bg-red-950 rounded-2xl p-8 text-center">
          <div className="text-8xl font-bold text-white mb-4">{questionsLeft}</div>
          <div className="text-2xl text-red-200">Questions Remaining</div>
        </div>

        <div className="bg-red-950 rounded-2xl p-6">
          <div className="text-white text-lg mb-4">Ask a yes/no question:</div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-4 rounded-lg text-lg"
            placeholder="Type your question..."
          />
        </div>

        <div className="flex gap-4">
          <GameButton onClick={() => setQuestionsLeft(Math.max(0, questionsLeft - 1))} className="flex-1">
            Ask Question
          </GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
