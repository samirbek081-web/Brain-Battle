"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"

const ALPHABET = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"

export default function BaldaPage() {
  const router = useRouter()
  const [board, setBoard] = useState<string[][]>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["К", "Р", "А", "Н", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ])
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [score, setScore] = useState({ player1: 0, player2: 0 })

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col])
  }

  const handleLetterClick = (letter: string) => {
    if (selectedCell) {
      const [row, col] = selectedCell
      const newBoard = [...board]
      newBoard[row] = [...newBoard[row]]
      newBoard[row][col] = letter
      setBoard(newBoard)
      setSelectedCell(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-950">
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
          <h1 className="text-3xl font-bold text-amber-200">БАЛДА</h1>
          <div className="text-white">P{currentPlayer}</div>
        </div>

        <div className="flex justify-around bg-gray-800 rounded-xl p-4">
          <div className="text-center">
            <div className="text-amber-200 text-sm">Player 1</div>
            <div className="text-white text-3xl font-bold">{score.player1}</div>
          </div>
          <div className="text-center">
            <div className="text-amber-200 text-sm">Player 2</div>
            <div className="text-white text-3xl font-bold">{score.player2}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-6 border-8 border-amber-950">
          <div className="grid grid-cols-5 gap-2">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`aspect-square bg-amber-100 rounded-lg flex items-center justify-center text-4xl font-bold hover:bg-amber-200 transition-colors ${
                    selectedCell?.[0] === i && selectedCell?.[1] === j ? "ring-4 ring-white" : ""
                  }`}
                >
                  {cell}
                </button>
              )),
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 max-h-32 overflow-y-auto">
          <div className="grid grid-cols-11 gap-1">
            {ALPHABET.split("").map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className="aspect-square bg-gray-700 hover:bg-gray-600 rounded text-white font-bold text-sm transition-colors"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <GameButton onClick={() => setCurrentPlayer(currentPlayer === 1 ? 2 : 1)} className="flex-1">
            End Turn
          </GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  )
}
