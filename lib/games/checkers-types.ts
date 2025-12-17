export type PieceColor = "red" | "black" | null
export type PieceType = "normal" | "king"

export interface Piece {
  color: PieceColor
  type: PieceType
}

export type Board = (Piece | null)[][]
