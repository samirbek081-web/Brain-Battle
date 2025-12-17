"use client"

import { useState } from "react"
import type { Board } from "@/lib/games/checkers-types"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Crown, Users, Zap } from "lucide-react"

export default function CheckersPage() {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "black">("red")
  const [winner, setWinner] = useState<"red" | "black" | null>(null)
  const [moves, setMoves] = useState(0)
  const [captures, setCaptures] = useState({ red: 0, black: 0 })
  const [kings, setKings] = useState({ red: 0, black: 0 })
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)
  const [validMoves, setValidMoves] = useState<[number, number][]>([])

  function initializeBoard(): Board {
    const board: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Place black pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: "black", type: "normal" }
        }
      }
    }

    // Place red pieces
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: "red", type: "normal" }
        }
      }
    }

    return board
  }

  const handleSquareClick = (row: number, col: number) => {
    if (winner) return

    const piece = board[row][col]

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare
      const selectedPiece = board[selectedRow][selectedCol]

      if (selectedPiece && selectedPiece.color === currentPlayer) {
        if (isValidMove(selectedRow, selectedCol, row, col)) {
          const newBoard = JSON.parse(JSON.stringify(board))

          const rowDiff = Math.abs(row - selectedRow)
          if (rowDiff === 2) {
            const captureRow = (selectedRow + row) / 2
            const captureCol = (selectedCol + col) / 2
            newBoard[captureRow][captureCol] = null

            setCaptures((prev) => ({
              ...prev,
              [currentPlayer]: prev[currentPlayer] + 1,
            }))

            const rect = document.querySelector(`[data-square="${captureRow}-${captureCol}"]`)?.getBoundingClientRect()
            if (rect) {
              setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
              setTimeout(() => setParticle(null), 1000)
            }
          }

          // Move piece
          newBoard[row][col] = selectedPiece
          newBoard[selectedRow][selectedCol] = null

          if ((selectedPiece.color === "red" && row === 0) || (selectedPiece.color === "black" && row === 7)) {
            if (selectedPiece.type !== "king") {
              newBoard[row][col].type = "king"
              setKings((prev) => ({
                ...prev,
                [currentPlayer]: prev[currentPlayer] + 1,
              }))
            }
          }

          setBoard(newBoard)
          setMoves((prev) => prev + 1)
          setCurrentPlayer(currentPlayer === "red" ? "black" : "red")
          setValidMoves([])

          // Check for winner
          if (!hasValidMoves(newBoard, currentPlayer === "red" ? "black" : "red")) {
            setWinner(currentPlayer)
          }
        }
      }
      setSelectedSquare(null)
    } else if (piece && piece.color === currentPlayer) {
      setSelectedSquare([row, col])
      const moves = getValidMovesForPiece(row, col)
      setValidMoves(moves)
    }
  }

  const getValidMovesForPiece = (row: number, col: number): [number, number][] => {
    const moves: [number, number][] = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(row, col, r, c)) {
          moves.push([r, c])
        }
      }
    }
    return moves
  }

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol]
    if (!piece || board[toRow][toCol]) return false

    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)

    // Normal move
    if (Math.abs(rowDiff) === 1 && colDiff === 1) {
      if (piece.type === "king") return true
      return (piece.color === "red" && rowDiff === -1) || (piece.color === "black" && rowDiff === 1)
    }

    // Capture move
    if (Math.abs(rowDiff) === 2 && colDiff === 2) {
      const middleRow = (fromRow + toRow) / 2
      const middleCol = (fromCol + toCol) / 2
      const middlePiece = board[middleRow][middleCol]

      if (middlePiece && middlePiece.color !== piece.color) {
        if (piece.type === "king") return true
        return (piece.color === "red" && rowDiff === -2) || (piece.color === "black" && rowDiff === 2)
      }
    }

    return false
  }

  const hasValidMoves = (board: Board, player: "red" | "black"): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color === player) {
          // Check all possible moves
          for (let newRow = 0; newRow < 8; newRow++) {
            for (let newCol = 0; newCol < 8; newCol++) {
              if (isValidMove(row, col, newRow, newCol)) {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }

  const resetGame = () => {
    setBoard(initializeBoard())
    setCurrentPlayer("red")
    setWinner(null)
    setSelectedSquare(null)
    setMoves(0)
    setCaptures({ red: 0, black: 0 })
    setKings({ red: 0, black: 0 })
  }

  const stats = (
    <div className="grid grid-cols-4 gap-4">
      <StatDisplay label="Moves" value={moves} icon={<Zap />} color="amber" />
      <StatDisplay label="Red Captures" value={captures.red} icon={<Users />} color="red" />
      <StatDisplay label="Black Captures" value={captures.black} icon={<Users />} color="blue" />
      <StatDisplay label="Kings" value={kings[currentPlayer]} icon={<Crown />} color="amber" />
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
      title="Checkers"
      stats={stats}
      controls={controls}
      background="from-slate-950 via-red-950/20 to-slate-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#fbbf24" count={20} />}

      <Board3D size="large">
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="glass-effect rounded-3xl p-8 border-2 border-amber-400 text-center shadow-2xl glow-pulse">
              <Crown className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h2 className="text-4xl font-bold text-amber-400 mb-2">
                {winner === currentPlayer ? "Victory!" : "Defeat"}
              </h2>
              <p className="text-xl text-white/70 capitalize">{winner} player wins!</p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-white">
            Current Player:{" "}
            <span className={currentPlayer === "red" ? "text-red-400" : "text-gray-300"}>{currentPlayer}</span>
          </p>
        </div>

        <div className="grid grid-cols-8 gap-1 mx-auto max-w-2xl">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex
              const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex)

              if (isLight) {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square bg-[#d4b896] rounded-lg"
                    data-square={`${rowIndex}-${colIndex}`}
                  />
                )
              }

              return (
                <GamePiece
                  key={`${rowIndex}-${colIndex}`}
                  data-square={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  selected={isSelected}
                  color={isValidMove ? "#6b7f47" : "#8b6f47"}
                  className={`aspect-square flex items-center justify-center ${
                    isValidMove ? "ring-2 ring-green-400/50" : ""
                  }`}
                  glowColor={isSelected ? "rgba(255, 215, 0, 0.6)" : undefined}
                >
                  {piece && (
                    <div
                      className={`w-4/5 h-4/5 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-2xl ${
                        piece.color === "red"
                          ? "bg-gradient-to-br from-red-500 to-red-700"
                          : "bg-gradient-to-br from-gray-800 to-gray-950"
                      } ${piece.type === "king" ? "ring-4 ring-amber-400" : ""}`}
                      style={{
                        boxShadow:
                          piece.color === "red"
                            ? "0 4px 8px rgba(239, 68, 68, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
                            : "0 4px 8px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {piece.type === "king" && <Crown className="w-8 h-8 text-amber-400" />}
                    </div>
                  )}
                </GamePiece>
              )
            }),
          )}
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
