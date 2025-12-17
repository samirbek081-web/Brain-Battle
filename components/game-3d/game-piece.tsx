"use client"

import type { ReactNode, CSSProperties } from "react"

interface GamePieceProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  selected?: boolean
  color?: string
  className?: string
  glowColor?: string
}

export function GamePiece({
  children,
  onClick,
  disabled = false,
  selected = false,
  color,
  className = "",
  glowColor = "rgba(255, 215, 0, 0.5)",
}: GamePieceProps) {
  const style: CSSProperties = color ? { backgroundColor: color } : {}

  if (selected) {
    style.boxShadow = `0 0 30px ${glowColor}, 0 8px 16px rgba(0, 0, 0, 0.4)`
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`game-piece-3d rounded-xl transition-all duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? "scale-105 ring-2 ring-amber-400" : ""} ${className}`}
      style={style}
    >
      {children}
    </button>
  )
}
