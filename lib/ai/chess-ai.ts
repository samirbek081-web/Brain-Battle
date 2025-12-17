import type { AIConfig } from "./difficulty-levels"

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
type PieceColor = "white" | "black"

interface Piece {
  type: PieceType
  color: PieceColor
}

type Board = (Piece | null)[][]

interface Move {
  from: [number, number]
  to: [number, number]
  score: number
}

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 100,
}

export class ChessAI {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async getBestMove(board: Board, color: PieceColor): Promise<{ from: [number, number]; to: [number, number] } | null> {
    // Simulate thinking time
    await new Promise((resolve) => setTimeout(resolve, this.config.thinkingTime))

    const allMoves = this.getAllValidMoves(board, color)

    if (allMoves.length === 0) return null

    // Add random errors based on difficulty
    if (Math.random() < this.config.errorRate) {
      // Make a random move
      return allMoves[Math.floor(Math.random() * allMoves.length)]
    }

    // Score all moves
    const scoredMoves: Move[] = allMoves.map((move) => ({
      ...move,
      score: this.evaluateMove(board, move, color),
    }))

    // Sort by score (best first)
    scoredMoves.sort((a, b) => b.score - a.score)

    // Return best move
    return scoredMoves[0]
  }

  private getAllValidMoves(board: Board, color: PieceColor): Array<{ from: [number, number]; to: [number, number] }> {
    const moves: Array<{ from: [number, number]; to: [number, number] }> = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color === color) {
          // Check all possible destination squares
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(board, row, col, toRow, toCol)) {
                moves.push({ from: [row, col], to: [toRow, toCol] })
              }
            }
          }
        }
      }
    }

    return moves
  }

  private isValidMove(board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const piece = board[fromRow][fromCol]
    if (!piece) return false

    const targetPiece = board[toRow][toCol]
    if (targetPiece && targetPiece.color === piece.color) return false

    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        if (colDiff === 0 && toRow === fromRow + direction && !targetPiece) return true
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) return true
        // Initial double move
        if (
          colDiff === 0 &&
          toRow === fromRow + 2 * direction &&
          !targetPiece &&
          ((piece.color === "white" && fromRow === 6) || (piece.color === "black" && fromRow === 1))
        )
          return true
        return false
      case "rook":
        return (rowDiff === 0 || colDiff === 0) && this.isPathClear(board, fromRow, fromCol, toRow, toCol)
      case "knight":
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      case "bishop":
        return rowDiff === colDiff && this.isPathClear(board, fromRow, fromCol, toRow, toCol)
      case "queen":
        return (
          (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) &&
          this.isPathClear(board, fromRow, fromCol, toRow, toCol)
        )
      case "king":
        return rowDiff <= 1 && colDiff <= 1
      default:
        return false
    }
  }

  private isPathClear(board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const rowDir = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
    const colDir = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0

    let currentRow = fromRow + rowDir
    let currentCol = fromCol + colDir

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) return false
      currentRow += rowDir
      currentCol += colDir
    }

    return true
  }

  private evaluateMove(
    board: Board,
    move: { from: [number, number]; to: [number, number] },
    color: PieceColor,
  ): number {
    let score = 0

    // Make a copy of the board and simulate the move
    const simulatedBoard = JSON.parse(JSON.stringify(board))
    const piece = simulatedBoard[move.from[0]][move.from[1]]
    const capturedPiece = simulatedBoard[move.to[0]][move.to[1]]

    simulatedBoard[move.to[0]][move.to[1]] = piece
    simulatedBoard[move.from[0]][move.from[1]] = null

    // Reward capturing pieces
    if (capturedPiece) {
      score += PIECE_VALUES[capturedPiece.type] * 10
    }

    // Reward controlling the center
    const centerDistance = Math.abs(move.to[0] - 3.5) + Math.abs(move.to[1] - 3.5)
    score += (7 - centerDistance) * 0.5

    // Penalize moving the king too early
    if (piece.type === "king" && move.from[0] === (color === "white" ? 7 : 0)) {
      score -= 5
    }

    // Reward developing pieces
    if (["knight", "bishop"].includes(piece.type)) {
      score += 2
    }

    return score
  }
}
