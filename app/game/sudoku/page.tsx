"use client"

import { useState } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Clock, Target, Zap } from "lucide-react"

export default function SudokuPage() {
  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false
    }

    const startRow = row - (row % 3)
    const startCol = col - (col % 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false
      }
    }
    return true
  }

  const solveSudoku = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num
              if (solveSudoku(board)) return true
              board[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  const generatePuzzle = (): { puzzle: number[][]; solution: number[][] } => {
    const solution = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))

    for (let box = 0; box < 9; box += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
      let idx = 0
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          solution[box + i][box + j] = nums[idx++]
        }
      }
    }

    solveSudoku(solution)

    const puzzle = solution.map((row) => [...row])
    let cellsToRemove = 40

    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0
        cellsToRemove--
      }
    }

    return { puzzle, solution }
  }

  const [game, setGame] = useState(() => generatePuzzle())
  const [puzzle, setPuzzle] = useState(game.puzzle)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)

  const handleCellClick = (row: number, col: number) => {
    if (game.puzzle[row][col] === 0) {
      setSelected([row, col])
    }
  }

  const handleNumberInput = (num: number) => {
    if (!selected) return
    const [row, col] = selected
    const newPuzzle = puzzle.map((r) => [...r])
    newPuzzle[row][col] = num
    setPuzzle(newPuzzle)
    setMoves((prev) => prev + 1)

    if (game.solution[row][col] !== num) {
      setErrors(new Set(errors).add(`${row}-${col}`))
    } else {
      const newErrors = new Set(errors)
      newErrors.delete(`${row}-${col}`)
      setErrors(newErrors)

      const rect = document.querySelector(`[data-cell="${row}-${col}"]`)?.getBoundingClientRect()
      if (rect) {
        setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setTimeout(() => setParticle(null), 800)
      }
    }

    if (newPuzzle.every((row, i) => row.every((cell, j) => cell === game.solution[i][j]))) {
      setTimeout(() => alert("Congratulations! You solved it!"), 300)
    }
  }

  const newGame = () => {
    const newGameState = generatePuzzle()
    setGame(newGameState)
    setPuzzle(newGameState.puzzle)
    setSelected(null)
    setErrors(new Set())
    setMoves(0)
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Moves" value={moves} icon={<Zap />} color="amber" />
      <StatDisplay label="Errors" value={errors.size} icon={<Target />} color="red" />
      <StatDisplay
        label="Remaining"
        value={puzzle.flat().filter((c) => c === 0).length}
        icon={<Clock />}
        color="blue"
      />
    </div>
  )

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <GameButton3D
            key={num}
            onClick={() => handleNumberInput(num)}
            variant="primary"
            className="aspect-square text-2xl"
          >
            {num}
          </GameButton3D>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GameButton3D onClick={newGame} variant="success">
          New Puzzle
        </GameButton3D>
        <GameButton3D onClick={() => (window.location.href = "/classic")} variant="secondary">
          Back to Menu
        </GameButton3D>
      </div>
    </div>
  )

  return (
    <GameLayout3D
      title="Sudoku"
      stats={stats}
      controls={controls}
      background="from-indigo-950 via-blue-950 to-indigo-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#22c55e" count={20} />}

      <Board3D size="large">
        <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-2xl mx-auto">
          <div className="grid grid-cols-9 gap-0 border-4 border-indigo-900 rounded-xl overflow-hidden">
            {puzzle.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <GamePiece
                  key={`${rowIndex}-${colIndex}`}
                  data-cell={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={game.puzzle[rowIndex][colIndex] !== 0}
                  selected={selected?.[0] === rowIndex && selected?.[1] === colIndex}
                  color={
                    selected?.[0] === rowIndex && selected?.[1] === colIndex
                      ? "#dbeafe"
                      : game.puzzle[rowIndex][colIndex] !== 0
                        ? "#eff6ff"
                        : "#ffffff"
                  }
                  className={`aspect-square flex items-center justify-center text-2xl font-bold transition-all
                    ${colIndex % 3 === 2 && colIndex < 8 ? "border-r-4 border-indigo-900" : "border-r border-indigo-300"}
                    ${rowIndex % 3 === 2 && rowIndex < 8 ? "border-b-4 border-indigo-900" : "border-b border-indigo-300"}
                    ${errors.has(`${rowIndex}-${colIndex}`) ? "text-red-500" : game.puzzle[rowIndex][colIndex] !== 0 ? "text-indigo-900" : "text-blue-600"}
                  `}
                >
                  {cell !== 0 ? cell : ""}
                </GamePiece>
              )),
            )}
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
