"use client"

import { useState } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { Circle, Users } from "lucide-react"

type Stone = "black" | "white" | null

export default function GoPage() {
  const boardSize = 19
  const [board, setBoard] = useState<Stone[][]>(
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black")
  const [capturedBlack, setCapturedBlack] = useState(0)
  const [capturedWhite, setCapturedWhite] = useState(0)
  const [moves, setMoves] = useState(0)

  const handleClick = (row: number, col: number) => {
    if (board[row][col]) return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = currentPlayer

    // Check for captures
    const captured = checkCaptures(newBoard, row, col)
    if (currentPlayer === "black") {
      setCapturedWhite((prev) => prev + captured)
    } else {
      setCapturedBlack((prev) => prev + captured)
    }

    setBoard(newBoard)
    setMoves((prev) => prev + 1)
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black")
  }

  const checkCaptures = (board: Stone[][], row: number, col: number): number => {
    let captured = 0
    const opponent = currentPlayer === "black" ? "white" : "black"
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    for (const [dr, dc] of directions) {
      const r = row + dr
      const c = col + dc
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === opponent) {
        const group = getGroup(board, r, c, opponent)
        if (!hasLiberties(board, group)) {
          group.forEach(([gr, gc]) => {
            board[gr][gc] = null
            captured++
          })
        }
      }
    }

    return captured
  }

  const getGroup = (board: Stone[][], row: number, col: number, color: "black" | "white"): [number, number][] => {
    const group: [number, number][] = []
    const visited = new Set<string>()
    const stack: [number, number][] = [[row, col]]

    while (stack.length > 0) {
      const [r, c] = stack.pop()!
      const key = `${r},${c}`
      if (visited.has(key)) continue
      visited.add(key)

      if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) continue
      if (board[r][c] !== color) continue

      group.push([r, c])
      stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
    }

    return group
  }

  const hasLiberties = (board: Stone[][], group: [number, number][]): boolean => {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    for (const [r, c] of group) {
      for (const [dr, dc] of directions) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc] === null) {
          return true
        }
      }
    }

    return false
  }

  const resetGame = () => {
    setBoard(
      Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(null)),
    )
    setCurrentPlayer("black")
    setCapturedBlack(0)
    setCapturedWhite(0)
    setMoves(0)
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Moves" value={moves} icon={<Circle />} color="amber" />
      <StatDisplay label="Black Captured" value={capturedWhite} icon={<Users />} color="blue" />
      <StatDisplay label="White Captured" value={capturedBlack} icon={<Users />} color="green" />
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
    <GameLayout3D title="Go" stats={stats} controls={controls} background="from-amber-950 via-amber-900 to-amber-950">
      <Board3D size="large">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-white">
            Current Player:{" "}
            <span className={currentPlayer === "black" ? "text-gray-300" : "text-white"}>{currentPlayer}</span>
          </p>
        </div>

        <div className="overflow-auto max-h-[70vh]">
          <div className="inline-block bg-gradient-to-br from-amber-700 to-amber-800 p-6 rounded-2xl">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${boardSize}, 2rem)` }}>
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <GamePiece
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    color="transparent"
                    className="relative w-8 h-8 flex items-center justify-center transition-all hover:bg-white/10"
                    style={{
                      borderRight: colIndex < boardSize - 1 ? "2px solid #78350f" : "none",
                      borderBottom: rowIndex < boardSize - 1 ? "2px solid #78350f" : "none",
                    }}
                  >
                    {cell && (
                      <div
                        className={`w-7 h-7 rounded-full shadow-2xl transition-transform hover:scale-110 ${
                          cell === "black"
                            ? "bg-gradient-to-br from-gray-800 to-black"
                            : "bg-gradient-to-br from-gray-100 to-white"
                        }`}
                        style={{
                          boxShadow:
                            cell === "black"
                              ? "0 4px 8px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1)"
                              : "0 4px 8px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
                        }}
                      />
                    )}
                  </GamePiece>
                )),
              )}
            </div>
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
