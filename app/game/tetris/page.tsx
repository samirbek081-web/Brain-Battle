"use client"

import { useState, useEffect, useCallback } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { Trophy, Layers, Zap } from "lucide-react"

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

type Tetromino = number[][]

const TETROMINOS: Tetromino[] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
]

const COLORS = ["#00f0f0", "#f0f000", "#a000f0", "#f0a000", "#0000f0", "#00f000", "#f00000"]

export default function TetrisPage() {
  const [board, setBoard] = useState<number[][]>(
    Array(BOARD_HEIGHT)
      .fill(0)
      .map(() => Array(BOARD_WIDTH).fill(0)),
  )
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(TETROMINOS[0])
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 })
  const [currentColor, setCurrentColor] = useState(0)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const spawnPiece = () => {
    const pieceIndex = Math.floor(Math.random() * TETROMINOS.length)
    setCurrentPiece(TETROMINOS[pieceIndex])
    setCurrentColor(pieceIndex)
    setCurrentPosition({ x: 4, y: 0 })
  }

  const checkCollision = (piece: Tetromino, pos: { x: number; y: number }): boolean => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true
          if (newY >= 0 && board[newY][newX]) return true
        }
      }
    }
    return false
  }

  const mergePiece = () => {
    const newBoard = board.map((row) => [...row])
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const boardY = currentPosition.y + y
          const boardX = currentPosition.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentColor + 1
          }
        }
      }
    }

    let linesCleared = 0
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        newBoard.splice(y, 1)
        newBoard.unshift(Array(BOARD_WIDTH).fill(0))
        linesCleared++
        y++
      }
    }

    setBoard(newBoard)
    setScore((prev) => prev + linesCleared * 100 * level)
    setLines((prev) => prev + linesCleared)
    setLevel(Math.floor(lines / 10) + 1)

    if (checkCollision(TETROMINOS[0], { x: 4, y: 0 })) {
      setGameOver(true)
    } else {
      spawnPiece()
    }
  }

  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return
    const newPos = { ...currentPosition, y: currentPosition.y + 1 }
    if (checkCollision(currentPiece, newPos)) {
      mergePiece()
    } else {
      setCurrentPosition(newPos)
    }
  }, [currentPosition, currentPiece, gameOver, isPaused])

  useEffect(() => {
    const interval = setInterval(moveDown, Math.max(100, 1000 - level * 50))
    return () => clearInterval(interval)
  }, [moveDown, level])

  const moveLeft = () => {
    const newPos = { ...currentPosition, x: currentPosition.x - 1 }
    if (!checkCollision(currentPiece, newPos)) {
      setCurrentPosition(newPos)
    }
  }

  const moveRight = () => {
    const newPos = { ...currentPosition, x: currentPosition.x + 1 }
    if (!checkCollision(currentPiece, newPos)) {
      setCurrentPosition(newPos)
    }
  }

  const rotate = () => {
    const rotated = currentPiece[0].map((_, i) => currentPiece.map((row) => row[i]).reverse())
    if (!checkCollision(rotated, currentPosition)) {
      setCurrentPiece(rotated)
    }
  }

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const boardY = currentPosition.y + y
          const boardX = currentPosition.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = currentColor + 1
          }
        }
      }
    }
    return displayBoard
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Score" value={score} icon={<Trophy />} color="amber" />
      <StatDisplay label="Lines" value={lines} icon={<Layers />} color="blue" />
      <StatDisplay label="Level" value={level} icon={<Zap />} color="green" />
    </div>
  )

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <GameButton3D onClick={moveLeft} variant="secondary">
          ←
        </GameButton3D>
        <GameButton3D onClick={rotate} variant="primary">
          Rotate
        </GameButton3D>
        <GameButton3D onClick={moveRight} variant="secondary">
          →
        </GameButton3D>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GameButton3D onClick={() => setIsPaused(!isPaused)} variant="success">
          {isPaused ? "Resume" : "Pause"}
        </GameButton3D>
        <GameButton3D onClick={() => window.location.reload()} variant="danger">
          New Game
        </GameButton3D>
      </div>
    </div>
  )

  return (
    <GameLayout3D
      title="Tetris"
      stats={stats}
      controls={controls}
      background="from-purple-950 via-indigo-950 to-purple-950"
    >
      <Board3D size="medium">
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="glass-effect rounded-3xl p-8 border-2 border-red-400 text-center shadow-2xl">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-4xl font-bold text-red-400 mb-2">Game Over!</h2>
              <p className="text-xl text-white/70">Final Score: {score}</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl shadow-2xl">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}>
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="aspect-square border border-gray-800 rounded-sm transition-all shadow-inner"
                  style={{
                    backgroundColor: cell ? COLORS[cell - 1] : "#111",
                    boxShadow: cell ? `0 0 10px ${COLORS[cell - 1]}50` : "none",
                  }}
                />
              )),
            )}
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
