"use client"

import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface GameButton3DProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "success" | "danger"
  loading?: boolean
  className?: string
}

export function GameButton3D({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  loading = false,
  className = "",
}: GameButton3DProps) {
  const variants = {
    primary: "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900",
    secondary: "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white",
    success: "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white",
    danger: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-xl font-bold text-lg
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
