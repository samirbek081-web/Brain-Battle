"use client"

import type { ReactNode } from "react"

interface StatDisplayProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  color?: "amber" | "blue" | "green" | "red"
}

export function StatDisplay({ label, value, icon, color = "amber" }: StatDisplayProps) {
  const colors = {
    amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 border shadow-lg`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <div>
          <div className="text-sm opacity-70">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}
