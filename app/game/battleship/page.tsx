"use client"

import { useState, useEffect } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Anchor, Target, Users } from "lucide-react"

type CellState = "empty" | "ship" | "hit" | "miss"

interface Cell {
  state: CellState
  revealed: boolean
}

const BOARD_SIZE = 10
const SHIPS = [5, 4, 3, 3, 2]

export default function BattleshipPage() {
  const [playerBoard, setPlayerBoard] = useState<Cell[][]>([])
  const [computerBoard, setComputerBoard] = useState<Cell[][]>([])
  const [gamePhase, setGamePhase] = useState<"setup" | "playing" | "ended">("setup")
  const [winner, setWinner] = useState<"player" | "computer" | null>(null)
  const [currentShip, setCurrentShip] = useState(0)
  const [shipOrientation, setShipOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const [hits, setHits] = useState({ player: 0, computer: 0 })
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    initializeBoards()
  }, [])

  const initializeBoards = () => {
    const emptyBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() =>
        Array(BOARD_SIZE)
          .fill(null)
          .map(() => ({ state: "empty" as CellState, revealed: false })),
      )
    setPlayerBoard(JSON.parse(JSON.stringify(emptyBoard)))
    const computerBoardWithShips = placeComputerShips(JSON.parse(JSON.stringify(emptyBoard)))
    setComputerBoard(computerBoardWithShips)
  }

  const placeComputerShips = (board: Cell[][]): Cell[][] => {
    const newBoard = JSON.parse(JSON.stringify(board))

    for (const shipSize of SHIPS) {
      let placed = false
      while (!placed) {
        const orientation = Math.random() > 0.5 ? "horizontal" : "vertical"
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)

        if (canPlaceShip(newBoard, row, col, shipSize, orientation)) {
          placeShip(newBoard, row, col, shipSize, orientation)
          placed = true
        }
      }
    }

    return newBoard
  }

  const canPlaceShip = (board: Cell[][], row: number, col: number, size: number, orientation: string): boolean => {
    if (orientation === "horizontal") {
      if (col + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row][col + i].state === "ship") return false
      }
    } else {
      if (row + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row + i][col].state === "ship") return false
      }
    }
    return true
  }

  const placeShip = (board: Cell[][], row: number, col: number, size: number, orientation: string) => {
    if (orientation === "horizontal") {
      for (let i = 0; i < size; i++) {
        board[row][col + i].state = "ship"
      }
    } else {
      for (let i = 0; i < size; i++) {
        board[row + i][col].state = "ship"
      }
    }
  }

  const handlePlayerCellClick = (row: number, col: number) => {
    if (gamePhase !== "setup" || currentShip >= SHIPS.length) return

    const newBoard = JSON.parse(JSON.stringify(playerBoard))
    const shipSize = SHIPS[currentShip]

    if (canPlaceShip(newBoard, row, col, shipSize, shipOrientation)) {
      placeShip(newBoard, row, col, shipSize, shipOrientation)
      setPlayerBoard(newBoard)
      setCurrentShip(currentShip + 1)
    }
  }

  const handleComputerCellClick = (row: number, col: number) => {
    if (gamePhase !== "playing" || computerBoard[row][col].revealed) return

    const newBoard = JSON.parse(JSON.stringify(computerBoard))
    newBoard[row][col].revealed = true

    if (newBoard[row][col].state === "ship") {
      newBoard[row][col].state = "hit"
      setHits((prev) => ({ ...prev, player: prev.player + 1 }))

      const rect = document.querySelector(`[data-computer="${row}-${col}"]`)?.getBoundingClientRect()
      if (rect) {
        setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setTimeout(() => setParticle(null), 1000)
      }
    } else {
      newBoard[row][col].state = "miss"
    }

    setComputerBoard(newBoard)

    if (checkWinner(newBoard)) {
      setWinner("player")
      setGamePhase("ended")
      return
    }

    setTimeout(() => computerTurn(), 800)
  }

  const computerTurn = () => {
    const newBoard = JSON.parse(JSON.stringify(playerBoard))
    let row, col

    do {
      row = Math.floor(Math.random() * BOARD_SIZE)
      col = Math.floor(Math.random() * BOARD_SIZE)
    } while (newBoard[row][col].revealed)

    newBoard[row][col].revealed = true

    if (newBoard[row][col].state === "ship") {
      newBoard[row][col].state = "hit"
      setHits((prev) => ({ ...prev, computer: prev.computer + 1 }))
    } else {
      newBoard[row][col].state = "miss"
    }

    setPlayerBoard(newBoard)

    if (checkWinner(newBoard)) {
      setWinner("computer")
      setGamePhase("ended")
    }
  }

  const checkWinner = (board: Cell[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col].state === "ship") return false
      }
    }
    return true
  }

  const startGame = () => {
    if (currentShip === SHIPS.length) {
      setGamePhase("playing")
    }
  }

  const resetGame = () => {
    initializeBoards()
    setGamePhase("setup")
    setWinner(null)
    setCurrentShip(0)
    setShipOrientation("horizontal")
    setHits({ player: 0, computer: 0 })
  }

  const getCellColor = (cell: Cell, isPlayerBoard: boolean) => {
    if (!cell.revealed && !isPlayerBoard) return "#1e3a8a"
    if (cell.state === "hit") return "#dc2626"
    if (cell.state === "miss") return "#3b82f6"
    if (cell.state === "ship" && isPlayerBoard) return "#f59e0b"
    return "#1e3a8a"
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Your Hits" value={hits.player} icon={<Target />} color="green" />
      <StatDisplay label="Phase" value={gamePhase} icon={<Anchor />} color="blue" />
      <StatDisplay label="AI Hits" value={hits.computer} icon={<Users />} color="red" />
    </div>
  )

  const controls = (
    <div className="space-y-4">
      {gamePhase === "setup" && (
        <div className="space-y-3">
          <p className="text-center text-white text-lg">
            Place ship {currentShip + 1} of {SHIPS.length} (Size: {SHIPS[currentShip]})
          </p>
          <div className="flex gap-4 justify-center">
            <GameButton3D
              onClick={() => setShipOrientation(shipOrientation === "horizontal" ? "vertical" : "horizontal")}
              variant="secondary"
            >
              Rotate: {shipOrientation}
            </GameButton3D>
            {currentShip === SHIPS.length && (
              <GameButton3D onClick={startGame} variant="success">
                Start Battle!
              </GameButton3D>
            )}
          </div>
        </div>
      )}
      {gamePhase === "playing" && <p className="text-center text-white text-xl">Click on enemy board to attack!</p>}
      <div className="flex gap-4 justify-center">
        <GameButton3D onClick={resetGame} variant="primary">
          New Game
        </GameButton3D>
        <GameButton3D onClick={() => (window.location.href = "/classic")} variant="secondary">
          Back to Menu
        </GameButton3D>
      </div>
    </div>
  )

  return (
    <GameLayout3D
      title="Battleship"
      stats={stats}
      controls={controls}
      background="from-blue-950 via-cyan-950 to-blue-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#ef4444" count={30} />}

      <Board3D size="large">
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="glass-effect rounded-3xl p-8 border-2 border-blue-400 text-center shadow-2xl glow-pulse">
              <Anchor className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-4xl font-bold text-blue-400 mb-2">{winner === "player" ? "Victory!" : "Defeat!"}</h2>
              <p className="text-xl text-white/70">
                {winner === "player" ? "You sank all enemy ships!" : "Your fleet was destroyed!"}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl text-white mb-4 text-center font-bold">Your Fleet</h2>
            <div className="grid grid-cols-10 gap-1 bg-blue-900/50 p-4 rounded-2xl">
              {playerBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <GamePiece
                    key={`player-${rowIndex}-${colIndex}`}
                    onClick={() => handlePlayerCellClick(rowIndex, colIndex)}
                    disabled={gamePhase !== "setup"}
                    color={getCellColor(cell, true)}
                    className="aspect-square rounded-lg transition-all shadow-md"
                  />
                )),
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white mb-4 text-center font-bold">Enemy Waters</h2>
            <div className="grid grid-cols-10 gap-1 bg-blue-900/50 p-4 rounded-2xl">
              {computerBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <GamePiece
                    key={`computer-${rowIndex}-${colIndex}`}
                    data-computer={`${rowIndex}-${colIndex}`}
                    onClick={() => handleComputerCellClick(rowIndex, colIndex)}
                    disabled={gamePhase !== "playing" || cell.revealed}
                    color={getCellColor(cell, false)}
                    className="aspect-square rounded-lg transition-all shadow-md"
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
