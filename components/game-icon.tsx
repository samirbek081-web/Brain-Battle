"use client"

interface GameIconProps {
  icon: string
  name: string
  size?: "sm" | "md" | "lg"
}

export function GameIcon({ icon, name, size = "md" }: GameIconProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-xl bg-[#2a2a2a] border-2 border-[#3a3a3a] overflow-hidden`}
      title={name}
    >
      <img src={`/icons/${icon}.svg`} alt={name} className="w-full h-full p-2 object-contain select-none" />
    </div>
  )
}
