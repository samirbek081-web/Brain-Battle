"use client"

import type { ReactNode } from "react"

interface Board3DProps {
  children: ReactNode
  size?: "small" | "medium" | "large"
  className?: string
}

export function Board3D({ children, size = "medium", className = "" }: Board3DProps) {
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
  }

  return (
    <div className={`mx-auto ${sizeClasses[size]}`}>
      <div className={`game-board-3d rounded-3xl p-8 glass-effect border-2 border-white/20 shadow-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}
