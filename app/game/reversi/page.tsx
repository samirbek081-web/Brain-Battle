"use client"

import { useState, useEffect } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Trophy, Target } from "lucide-react"

type Cell = "black" | "white" | null
type Board = Cell[][]

export default function ReversiPage() {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black")
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [winner, setWinner] = useState<"black" | "white" | "draw" | null>(null)
  const [scores, setScores] = useState({ black: 2, white: 2 })
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)

  function initializeBoard(): Board {
    const board: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    board[3][3] = "white"
    board[3][4] = "black"
    board[4][3] = "black"
    board[4][4] = "white"
    return board
  }

  useEffect(() => {
    const moves = getValidMoves(board, currentPlayer)
    setValidMoves(moves)
    updateScores()

    if (moves.length === 0) {
      const otherPlayer = currentPlayer === "black" ? "white" : "black"
      const otherMoves = getValidMoves(board, otherPlayer)

      if (otherMoves.length === 0) {
        determineWinner()
      } else {
        setCurrentPlayer(otherPlayer)
      }
    }
  }, [board, currentPlayer])

  const getValidMoves = (board: Board, player: "black" | "white"): [number, number][] => {
    const moves: [number, number][] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === null && canPlaceDisc(board, row, col, player)) {
          moves.push([row, col])
        }
      }
    }

    return moves
  }

  const canPlaceDisc = (board: Board, row: number, col: number, player: "black" | "white"): boolean => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      if (checkDirection(board, row, col, dr, dc, player)) {
        return true
      }
    }

    return false
  }

  const checkDirection = (
    board: Board,
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: "black" | "white",
  ): boolean => {
    const opponent = player === "black" ? "white" : "black"
    let r = row + dr
    let c = col + dc
    let foundOpponent = false

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === null) return false
      if (board[r][c] === opponent) {
        foundOpponent = true
      } else if (board[r][c] === player) {
        return foundOpponent
      }
      r += dr
      c += dc
    }

    return false
  }

  const flipDiscs = (board: Board, row: number, col: number, player: "black" | "white"): Board => {
    const newBoard = JSON.parse(JSON.stringify(board))
    newBoard[row][col] = player
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      if (checkDirection(board, row, col, dr, dc, player)) {
        let r = row + dr
        let c = col + dc

        while (newBoard[r][c] !== player) {
          newBoard[r][c] = player
          r += dr
          c += dc
        }
      }
    }

    return newBoard
  }

  const handleCellClick = (row: number, col: number) => {
    if (winner || !validMoves.some(([r, c]) => r === row && c === col)) return

    const rect = document.querySelector(`[data-square="${row}-${col}"]`)?.getBoundingClientRect()
    if (rect) {
      setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      setTimeout(() => setParticle(null), 1000)
    }

    const newBoard = flipDiscs(board, row, col, currentPlayer)
    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black")
  }

  const updateScores = () => {
    let black = 0
    let white = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === "black") black++
        if (board[row][col] === "white") white++
      }
    }

    setScores({ black, white })
  }

  const determineWinner = () => {
    if (scores.black > scores.white) setWinner("black")
    else if (scores.white > scores.black) setWinner("white")
    else setWinner("draw")
  }

  const resetGame = () => {
    setBoard(initializeBoard())
    setCurrentPlayer("black")
    setWinner(null)
    setScores({ black: 2, white: 2 })
  }

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(([r, c]) => r === row && c === col)
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Black Score" value={scores.black} icon={<Target />} color="blue" />
      <StatDisplay
        label="Current"
        value={currentPlayer}
        icon={<Trophy />}
        color={currentPlayer === "black" ? "blue" : "amber"}
      />
      <StatDisplay label="White Score" value={scores.white} icon={<Target />} color="amber" />
    </div>
  )

  const controls = (
    <div className="flex gap-4 justify-center">
      <GameButton3D onClick={resetGame} variant="primary">
        New Game
      </GameButton3D>
      <GameButton3D onClick={() => (window.location.href = "/classic")} variant="secondary">
        Back to Menu
      </GameButton3D>
    </div>
  )

  return (
    <GameLayout3D
      title="Reversi (Othello)"
      stats={stats}
      controls={controls}
      background="from-emerald-950 via-green-950 to-emerald-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#10b981" count={25} />}

      <Board3D size="large">
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="glass-effect rounded-3xl p-8 border-2 border-emerald-400 text-center shadow-2xl glow-pulse">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h2 className="text-4xl font-bold text-emerald-400 mb-2">
                {winner === "draw" ? "Draw!" : `${winner} Wins!`}
              </h2>
              <p className="text-xl text-white/70">
                Final Score: Black {scores.black} - White {scores.white}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 gap-2 mx-auto max-w-2xl p-4 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-3xl shadow-2xl">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isValid = isValidMove(rowIndex, colIndex)

              return (
                <GamePiece
                  key={`${rowIndex}-${colIndex}`}
                  data-square={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={!isValid && !cell}
                  color="#059669"
                  className={`aspect-square flex items-center justify-center rounded-xl ${
                    isValid ? "ring-2 ring-amber-400/60 hover:ring-amber-400" : ""
                  }`}
                >
                  {cell && (
                    <div
                      className={`w-4/5 h-4/5 rounded-full transition-all duration-500 shadow-2xl ${
                        cell === "black"
                          ? "bg-gradient-to-br from-gray-800 to-black"
                          : "bg-gradient-to-br from-gray-100 to-white"
                      }`}
                      style={{
                        boxShadow:
                          cell === "black"
                            ? "0 4px 12px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1)"
                            : "0 4px 12px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
                        transform: "rotateY(0deg)",
                        animation: cell ? "flipIn 0.4s ease-out" : "none",
                      }}
                    />
                  )}
                  {!cell && isValid && <div className="w-3 h-3 rounded-full bg-amber-400 opacity-60 animate-pulse" />}
                </GamePiece>
              )
            }),
          )}
        </div>
      </Board3D>

      <style jsx>{`
        @keyframes flipIn {
          0% {
            transform: rotateY(90deg) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </GameLayout3D>
  )
}
