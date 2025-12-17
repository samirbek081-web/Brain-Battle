"use client"

import { useState } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Move, Trophy } from "lucide-react"

export default function FifteenPuzzlePage() {
  const createSolvedPuzzle = () => Array.from({ length: 16 }, (_, i) => i)

  const shufflePuzzle = (puzzle: number[]) => {
    const newPuzzle = [...puzzle]
    for (let i = 0; i < 200; i++) {
      const emptyIndex = newPuzzle.indexOf(0)
      const moves = []
      if (emptyIndex % 4 > 0) moves.push(emptyIndex - 1)
      if (emptyIndex % 4 < 3) moves.push(emptyIndex + 1)
      if (emptyIndex >= 4) moves.push(emptyIndex - 4)
      if (emptyIndex < 12) moves.push(emptyIndex + 4)

      const randomMove = moves[Math.floor(Math.random() * moves.length)]
      ;[newPuzzle[emptyIndex], newPuzzle[randomMove]] = [newPuzzle[randomMove], newPuzzle[emptyIndex]]
    }
    return newPuzzle
  }

  const [puzzle, setPuzzle] = useState(() => shufflePuzzle(createSolvedPuzzle()))
  const [moves, setMoves] = useState(0)
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)
  const [solved, setSolved] = useState(false)

  const handleTileClick = (index: number) => {
    const emptyIndex = puzzle.indexOf(0)
    const canMove =
      (index === emptyIndex - 1 && emptyIndex % 4 !== 0) ||
      (index === emptyIndex + 1 && index % 4 !== 0) ||
      index === emptyIndex - 4 ||
      index === emptyIndex + 4

    if (canMove) {
      const rect = document.querySelector(`[data-tile="${index}"]`)?.getBoundingClientRect()
      if (rect) {
        setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setTimeout(() => setParticle(null), 600)
      }

      const newPuzzle = [...puzzle]
      ;[newPuzzle[emptyIndex], newPuzzle[index]] = [newPuzzle[index], newPuzzle[emptyIndex]]
      setPuzzle(newPuzzle)
      setMoves(moves + 1)

      // Check if solved
      const isSolved = newPuzzle.every((num, idx) => num === idx)
      if (isSolved) {
        setSolved(true)
      }
    }
  }

  const resetGame = () => {
    setPuzzle(shufflePuzzle(createSolvedPuzzle()))
    setMoves(0)
    setSolved(false)
  }

  const stats = (
    <div className="grid grid-cols-2 gap-4">
      <StatDisplay label="Moves" value={moves} icon={<Move />} color="amber" />
      <StatDisplay
        label="Status"
        value={solved ? "Solved!" : "Playing"}
        icon={<Trophy />}
        color={solved ? "green" : "blue"}
      />
    </div>
  )

  const controls = (
    <div className="flex gap-4 justify-center">
      <GameButton3D onClick={resetGame} variant="primary">
        New Puzzle
      </GameButton3D>
      <GameButton3D onClick={() => (window.location.href = "/classic")} variant="secondary">
        Back to Menu
      </GameButton3D>
    </div>
  )

  return (
    <GameLayout3D
      title="15 Puzzle"
      stats={stats}
      controls={controls}
      background="from-amber-950 via-orange-950 to-amber-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#f59e0b" count={15} />}

      <Board3D size="medium">
        {solved && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="glass-effect rounded-3xl p-8 border-2 border-green-400 text-center shadow-2xl glow-pulse">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h2 className="text-4xl font-bold text-green-400 mb-2">Solved!</h2>
              <p className="text-xl text-white/70">Completed in {moves} moves</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto p-6 bg-gradient-to-br from-amber-800 to-amber-900 rounded-3xl shadow-2xl">
          {puzzle.map((num, index) => (
            <GamePiece
              key={index}
              data-tile={index}
              onClick={() => handleTileClick(index)}
              disabled={num === 0}
              color={num === 0 ? "transparent" : "#d97706"}
              className={`aspect-square flex items-center justify-center text-4xl font-bold transition-all duration-200 ${
                num === 0 ? "opacity-0" : "shadow-2xl"
              }`}
            >
              {num !== 0 ? num : ""}
            </GamePiece>
          ))}
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
