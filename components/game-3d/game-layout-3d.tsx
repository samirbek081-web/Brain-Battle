"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface GameLayout3DProps {
  title: string
  children: ReactNode
  stats?: ReactNode
  controls?: ReactNode
  background?: string
}

export function GameLayout3D({
  title,
  children,
  stats,
  controls,
  background = "from-slate-950 via-slate-900 to-slate-950",
}: GameLayout3DProps) {
  const router = useRouter()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background} relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-radial from-amber-500/5 to-transparent rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="glass-effect border-b border-white/10 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/classic")}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
              </button>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                {title}
              </h1>

              <div className="w-12" />
            </div>
          </div>
        </header>

        {stats && (
          <div className="container mx-auto px-4 py-4">
            <div className="glass-effect rounded-2xl p-4 border border-white/10 shadow-2xl">{stats}</div>
          </div>
        )}

        <main className="flex-1 container mx-auto px-4 py-8 perspective-1000">
          <div className="preserve-3d">{children}</div>
        </main>

        {controls && (
          <div className="container mx-auto px-4 py-6">
            <div className="glass-effect rounded-2xl p-6 border border-white/10 shadow-2xl">{controls}</div>
          </div>
        )}
      </div>
    </div>
  )
}
