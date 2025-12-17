"use client"

import type React from "react"

interface GameButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  className?: string
}

export function GameButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: GameButtonProps) {
  const baseStyles = "px-8 py-4 rounded-2xl font-bold text-xl tracking-wide transition-all duration-200 no-select"

  const variantStyles = {
    primary: "bg-[#d4b896] text-[#1a1a1a] hover:bg-[#c9a870] active:bg-[#b89860]",
    secondary: "bg-[#2a2a2a] text-[#d4b896] border-2 border-[#d4b896] hover:bg-[#353535]",
  }

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  )
}
