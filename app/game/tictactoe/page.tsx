"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"

type Player = "X" | "O" | null

export default function TicTacToePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine([a, b, c])
        return squares[a]
      }
    }

    if (squares.every((square) => square !== null)) {
      return "draw" as Player
    }

    return null
  }

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#2c3e82]">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/classic")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">{t("tictactoe")}</h1>
          <div className="w-10" />
        </div>

        <div className="text-center">
          {!winner && (
            <p className="text-xl text-white">
              Player: <span className="font-bold text-yellow-400">{currentPlayer}</span>
            </p>
          )}
          {winner && winner !== "draw" && (
            <p className="text-2xl font-bold text-yellow-400">Player {winner} Wins! 🎉</p>
          )}
          {winner === "draw" && <p className="text-2xl font-bold text-gray-300">{t("draw")}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3 aspect-square max-w-sm mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner}
              className={`aspect-square rounded-xl text-5xl font-bold transition-all duration-200 ${
                winningLine.includes(index) ? "bg-yellow-400 text-blue-900" : "bg-blue-800 hover:bg-blue-700"
              } ${cell === "X" ? "text-red-500" : "text-blue-300"} ${
                !cell && !winner ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <GameButton onClick={resetGame} className="flex-1">
            {t("newGame")}
          </GameButton>
          <GameButton onClick={() => router.push("/classic")} variant="secondary" className="flex-1">
            {t("quit")}
          </GameButton>
        </div>
      </div>
    </div>
  )
}
