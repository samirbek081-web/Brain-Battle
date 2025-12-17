"use client"

import { useState } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { Card3D } from "@/components/game-3d/card-3d"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Coins, TrendingUp, Users } from "lucide-react"

type Card = { suit: string; value: string; id: string }

export default function PokerPage() {
  const suits = ["♠", "♥", "♦", "♣"]
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  const [playerHand, setPlayerHand] = useState<Card[]>(dealHand())
  const [communityCards, setCommunityCards] = useState<Card[]>(dealCommunityCards())
  const [pot, setPot] = useState(150)
  const [playerChips, setPlayerChips] = useState(1000)
  const [aiChips, setAIChips] = useState(1000)
  const [currentBet, setCurrentBet] = useState(25)
  const [phase, setPhase] = useState<"preflop" | "flop" | "turn" | "river" | "showdown">("flop")
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)
  const [message, setMessage] = useState("Your turn")

  function dealHand(): Card[] {
    return Array(2)
      .fill(null)
      .map((_, i) => ({
        suit: suits[Math.floor(Math.random() * suits.length)],
        value: values[Math.floor(Math.random() * values.length)],
        id: `player-${i}`,
      }))
  }

  function dealCommunityCards(): Card[] {
    return Array(5)
      .fill(null)
      .map((_, i) => ({
        suit: suits[Math.floor(Math.random() * suits.length)],
        value: values[Math.floor(Math.random() * values.length)],
        id: `community-${i}`,
      }))
  }

  const check = () => {
    setMessage("AI is thinking...")
    setTimeout(() => {
      setMessage("Your turn")
    }, 1000)
  }

  const call = () => {
    if (playerChips >= currentBet) {
      setPlayerChips((prev) => prev - currentBet)
      setPot((prev) => prev + currentBet)
      setMessage("You called")

      const rect = document.querySelector("[data-pot]")?.getBoundingClientRect()
      if (rect) {
        setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setTimeout(() => setParticle(null), 1000)
      }
    }
  }

  const raise = (amount: number) => {
    if (playerChips >= amount) {
      setPlayerChips((prev) => prev - amount)
      setPot((prev) => prev + amount)
      setCurrentBet(amount)
      setMessage(`You raised $${amount}`)
    }
  }

  const fold = () => {
    setMessage("You folded. AI wins!")
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const newGame = () => {
    setPlayerHand(dealHand())
    setCommunityCards(dealCommunityCards())
    setPot(150)
    setPlayerChips(1000)
    setAIChips(1000)
    setCurrentBet(25)
    setPhase("flop")
    setMessage("New game started")
  }

  const getCardColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-600" : "text-gray-900"
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Your Chips" value={`$${playerChips}`} icon={<Coins />} color="green" />
      <StatDisplay label="Pot" value={`$${pot}`} icon={<TrendingUp />} color="amber" data-pot />
      <StatDisplay label="AI Chips" value={`$${aiChips}`} icon={<Users />} color="red" />
    </div>
  )

  const controls = (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xl font-bold text-white mb-4">{message}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <GameButton3D onClick={check} variant="secondary">
          Check
        </GameButton3D>
        <GameButton3D onClick={call} variant="success">
          Call ${currentBet}
        </GameButton3D>
        <GameButton3D onClick={() => raise(currentBet * 2)} variant="primary">
          Raise ${currentBet * 2}
        </GameButton3D>
        <GameButton3D onClick={fold} variant="danger">
          Fold
        </GameButton3D>
      </div>
      <GameButton3D onClick={newGame} variant="secondary" className="w-full">
        New Game
      </GameButton3D>
    </div>
  )

  return (
    <GameLayout3D
      title="Texas Hold'em Poker"
      stats={stats}
      controls={controls}
      background="from-green-950 via-emerald-950 to-green-950"
    >
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#fbbf24" count={30} />}

      <Board3D size="large">
        <div className="space-y-8">
          {/* AI Player */}
          <div className="text-center">
            <p className="text-white mb-4 text-lg">AI Player - ${aiChips}</p>
            <div className="flex justify-center gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="w-24 h-32 rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center shadow-2xl border-2 border-blue-700"
                >
                  <span className="text-4xl text-blue-400">?</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Cards */}
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 border-4 border-green-700 shadow-2xl">
            <div className="text-center mb-4">
              <div className="inline-block px-6 py-2 bg-amber-500 rounded-full">
                <p className="text-2xl font-bold text-gray-900">POT: ${pot}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              {communityCards.map((card) => (
                <Card3D
                  key={card.id}
                  color="#ffffff"
                  className="w-24 h-36 flex flex-col items-center justify-center font-bold shadow-2xl border-2 border-gray-300"
                >
                  <div className={`text-3xl ${getCardColor(card.suit)}`}>{card.value}</div>
                  <div className={`text-4xl ${getCardColor(card.suit)}`}>{card.suit}</div>
                </Card3D>
              ))}
            </div>
          </div>

          {/* Player Hand */}
          <div className="text-center">
            <p className="text-white mb-4 text-lg">Your Hand - ${playerChips}</p>
            <div className="flex justify-center gap-4">
              {playerHand.map((card) => (
                <Card3D
                  key={card.id}
                  color="#ffffff"
                  className="w-28 h-40 flex flex-col items-center justify-center font-bold shadow-2xl border-4 border-amber-500 ring-2 ring-amber-400/50"
                >
                  <div className={`text-4xl ${getCardColor(card.suit)}`}>{card.value}</div>
                  <div className={`text-5xl ${getCardColor(card.suit)}`}>{card.suit}</div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
