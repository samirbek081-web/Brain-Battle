"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface ParticleBurstProps {
  x: number
  y: number
  color?: string
  count?: number
  onComplete?: () => void
}

export function ParticleBurst({ x, y, color = "#ffd700", count = 20, onComplete }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      newParticles.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1,
        color,
      })
    }
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)

        if (updated.length === 0 && onComplete) {
          onComplete()
        }

        return updated
      })
    }, 16)

    return () => clearInterval(interval)
  }, [x, y, color, count, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}
