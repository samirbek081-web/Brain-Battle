"use client"

import type { ReactNode, CSSProperties } from "react"

interface Card3DProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  faceUp?: boolean
  color?: string
  className?: string
}

export function Card3D({ children, onClick, disabled = false, faceUp = true, color, className = "" }: Card3DProps) {
  const style: CSSProperties = color ? { backgroundColor: color } : {}

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card-3d relative rounded-2xl transition-all duration-400 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${!faceUp ? "opacity-90" : ""} ${className}`}
      style={style}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </button>
  )
}
