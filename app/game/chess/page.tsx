"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChessAI } from "@/lib/ai/chess-ai"
import { getAIConfig, type DifficultyLevel } from "@/lib/ai/difficulty-levels"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { GamePiece } from "@/components/game-3d/game-piece"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Trophy, Zap } from "lucide-react"
import { InterstitialAd } from "@/components/ads/interstitial-ad"
import { AdManager } from "@/lib/ads/ad-manager"

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
type PieceColor = "white" | "black"

interface Piece {
  type: PieceType
  color: PieceColor
}

type Board = (Piece | null)[][]

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: { pawn: "♙", rook: "♖", knight: "♘", bishop: "♗", queen: "♕", king: "♔" },
  black: { pawn: "♟", rook: "♜", knight: "♞", bishop: "♝", queen: "♛", king: "♚" },
}

export default function ChessPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "ai"
  const difficulty = (searchParams.get("difficulty") as DifficultyLevel) || "medium"
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white")
  const [winner, setWinner] = useState<PieceColor | "draw" | null>(null)
  const [aiThinking, setAiThinking] = useState(false)
  const [chessAI] = useState(() => new ChessAI(getAIConfig(difficulty)))
  const [moves, setMoves] = useState(0)
  const [captures, setCaptures] = useState({ white: 0, black: 0 })
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [showAd, setShowAd] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  useEffect(() => {
    AdManager.loadAdScript()
  }, [])

  useEffect(() => {
    if (mode === "ai" && currentPlayer === "black" && !winner && !aiThinking) {
      makeAIMove()
    }
  }, [currentPlayer, mode, winner, aiThinking])

  useEffect(() => {
    if (winner) {
      setGameEnded(true)
    }
  }, [winner])

  const makeAIMove = async () => {
    setAiThinking(true)
    const move = await chessAI.getBestMove(board, "black")

    if (move) {
      const newBoard = JSON.parse(JSON.stringify(board))
      const piece = newBoard[move.from[0]][move.from[1]]
      newBoard[move.to[0]][move.to[1]] = piece
      newBoard[move.from[0]][move.from[1]] = null

      setBoard(newBoard)
      setMoves((prev) => prev + 1)
      setCurrentPlayer("white")
      setValidMoves([])

      // Check for checkmate
      if (isCheckmate(newBoard, "white")) {
        setWinner("black")
      }
    }

    setAiThinking(false)
  }

  function initializeBoard(): Board {
    const board: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Black pieces
    board[0] = [
      { type: "rook", color: "black" },
      { type: "knight", color: "black" },
      { type: "bishop", color: "black" },
      { type: "queen", color: "black" },
      { type: "king", color: "black" },
      { type: "bishop", color: "black" },
      { type: "knight", color: "black" },
      { type: "rook", color: "black" },
    ]
    board[1] = Array(8).fill({ type: "pawn", color: "black" })

    // White pieces
    board[6] = Array(8).fill({ type: "pawn", color: "white" })
    board[7] = [
      { type: "rook", color: "white" },
      { type: "knight", color: "white" },
      { type: "bishop", color: "white" },
      { type: "queen", color: "white" },
      { type: "king", color: "white" },
      { type: "bishop", color: "white" },
      { type: "knight", color: "white" },
      { type: "rook", color: "white" },
    ]

    return board
  }

  const handleSquareClick = (row: number, col: number) => {
    if (winner || aiThinking) return

    const piece = board[row][col]

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare
      const selectedPiece = board[selectedRow][selectedCol]

      if (selectedPiece && selectedPiece.color === currentPlayer) {
        if (isValidMove(selectedRow, selectedCol, row, col)) {
          const newBoard = JSON.parse(JSON.stringify(board))
          const targetPiece = newBoard[row][col]

          if (targetPiece) {
            setCaptures((prev) => ({
              ...prev,
              [currentPlayer]: prev[currentPlayer] + 1,
            }))
            const rect = document.querySelector(`[data-square="${row}-${col}"]`)?.getBoundingClientRect()
            if (rect) {
              setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
              setTimeout(() => setParticle(null), 1000)
            }
          }

          newBoard[row][col] = selectedPiece
          newBoard[selectedRow][selectedCol] = null
          setBoard(newBoard)
          setMoves((prev) => prev + 1)
          setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
          setValidMoves([])

          // Check for checkmate
          if (isCheckmate(newBoard, currentPlayer === "white" ? "black" : "white")) {
            setWinner(currentPlayer)
          }
        }
      }
      setSelectedSquare(null)
    } else if (piece && piece.color === currentPlayer) {
      setSelectedSquare([row, col])
      // Show valid moves for selected piece
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

  const isCheckmate = (board: Board, player: PieceColor): boolean => {
    // Simplified checkmate detection - check if king can be captured
    let kingPos: [number, number] | null = null
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.type === "king" && board[r][c]?.color === player) {
          kingPos = [r, c]
          break
        }
      }
    }
    return !kingPos
  }

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol]
    if (!piece) return false

    const targetPiece = board[toRow][toCol]
    if (targetPiece && targetPiece.color === piece.color) return false

    // Simplified validation - just check basic moves
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        if (colDiff === 0 && toRow === fromRow + direction && !targetPiece) return true
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) return true
        return false
      case "rook":
        return rowDiff === 0 || colDiff === 0
      case "knight":
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      case "bishop":
        return rowDiff === colDiff
      case "queen":
        return rowDiff === colDiff || rowDiff === 0 || colDiff === 0
      case "king":
        return rowDiff <= 1 && colDiff <= 1
      default:
        return false
    }
  }

  const resetGame = () => {
    if (gameEnded && AdManager.shouldShowAd()) {
      setShowAd(true)
    }

    setBoard(initializeBoard())
    setCurrentPlayer("white")
    setWinner(null)
    setSelectedSquare(null)
    setMoves(0)
    setCaptures({ white: 0, black: 0 })
    setParticle(null)
    setValidMoves([])
    setGameEnded(false)
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Moves" value={moves} icon={<Zap />} color="amber" />
      <StatDisplay label="Your Captures" value={captures.white} icon={<Trophy />} color="green" />
      <StatDisplay label="AI Captures" value={captures.black} icon={<Trophy />} color="red" />
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
    <>
      <InterstitialAd
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onAdComplete={() => {
          setShowAd(false)
        }}
      />

      <GameLayout3D
        title="Chess"
        stats={stats}
        controls={controls}
        background="from-slate-950 via-amber-950/20 to-slate-950"
      >
        {particle && <ParticleBurst x={particle.x} y={particle.y} color="#ff6b6b" count={15} />}

        <Board3D size="large">
          {winner && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="glass-effect rounded-3xl p-8 border-2 border-amber-400 text-center shadow-2xl glow-pulse">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                <h2 className="text-4xl font-bold text-amber-400 mb-2">{winner === "white" ? "Victory!" : "Defeat"}</h2>
                <p className="text-xl text-white/70">{winner === "white" ? "You won the game!" : "AI won the game!"}</p>
              </div>
            </div>
          )}

          {aiThinking && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="glass-effect rounded-2xl p-6 border border-white/20">
                <p className="text-xl text-amber-400 animate-pulse">AI is thinking...</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-white">
              Current Player:{" "}
              <span className={currentPlayer === "white" ? "text-amber-400" : "text-blue-400"}>{currentPlayer}</span>
            </p>
          </div>

          <div className="grid grid-cols-8 gap-1 mx-auto max-w-2xl">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0
                const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex
                const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex)

                return (
                  <GamePiece
                    key={`${rowIndex}-${colIndex}`}
                    data-square={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    disabled={aiThinking || (mode === "ai" && currentPlayer === "black")}
                    selected={isSelected}
                    color={isLight ? (isValidMove ? "#d4b896" : "#f0d9b5") : isValidMove ? "#8b6f47" : "#b58863"}
                    className={`aspect-square flex items-center justify-center text-5xl transition-all ${
                      isValidMove ? "ring-2 ring-green-500/50" : ""
                    }`}
                    glowColor={isSelected ? "rgba(255, 215, 0, 0.6)" : undefined}
                  >
                    {piece && (
                      <span
                        className="drop-shadow-lg transition-transform hover:scale-110"
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                        }}
                      >
                        {pieceSymbols[piece.color][piece.type]}
                      </span>
                    )}
                  </GamePiece>
                )
              }),
            )}
          </div>
        </Board3D>
      </GameLayout3D>
    </>
  )
}
