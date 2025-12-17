"use client"

import { useState, useEffect } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { Card3D } from "@/components/game-3d/card-3d"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { ParticleBurst } from "@/components/game-3d/particle-burst"
import { Layers, User, Bot } from "lucide-react"

type CardColor = "red" | "yellow" | "green" | "blue"
type CardValue = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "Skip" | "Reverse" | "+2" | "Wild" | "+4"

interface Card {
  color: CardColor | "wild"
  value: CardValue
  id: string
}

export default function UnoPage() {
  const createDeck = (): Card[] => {
    const deck: Card[] = []
    const colors: CardColor[] = ["red", "yellow", "green", "blue"]
    const values: CardValue[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse", "+2"]

    colors.forEach((color) => {
      values.forEach((value) => {
        deck.push({ color, value, id: `${color}-${value}-1` })
        if (value !== "0") {
          deck.push({ color, value, id: `${color}-${value}-2` })
        }
      })
    })

    for (let i = 0; i < 4; i++) {
      deck.push({ color: "wild", value: "Wild", id: `wild-${i}` })
      deck.push({ color: "wild", value: "+4", id: `wild4-${i}` })
    }

    return deck.sort(() => Math.random() - 0.5)
  }

  const [deck, setDeck] = useState<Card[]>(createDeck())
  const [discardPile, setDiscardPile] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [computerHand, setComputerHand] = useState<Card[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "computer">("player")
  const [message, setMessage] = useState("Your turn!")
  const [particle, setParticle] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const newDeck = [...deck]
    const pHand: Card[] = []
    const cHand: Card[] = []

    for (let i = 0; i < 7; i++) {
      pHand.push(newDeck.pop()!)
      cHand.push(newDeck.pop()!)
    }

    const firstCard = newDeck.pop()!
    setPlayerHand(pHand)
    setComputerHand(cHand)
    setDiscardPile([firstCard])
    setDeck(newDeck)
  }, [])

  useEffect(() => {
    if (currentPlayer === "computer" && computerHand.length > 0) {
      setTimeout(() => computerPlay(), 1500)
    }
  }, [currentPlayer])

  const getCardColor = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "#dc2626",
      yellow: "#fbbf24",
      green: "#16a34a",
      blue: "#2563eb",
      wild: "#1f2937",
    }
    return colorMap[color] || "#000"
  }

  const canPlayCard = (card: Card, topCard: Card): boolean => {
    if (card.color === "wild") return true
    return card.color === topCard.color || card.value === topCard.value
  }

  const playCard = (card: Card, hand: Card[], setHand: (hand: Card[]) => void) => {
    const newHand = hand.filter((c) => c.id !== card.id)
    setHand(newHand)
    setDiscardPile([...discardPile, card])

    const rect = document.querySelector("[data-discard]")?.getBoundingClientRect()
    if (rect) {
      setParticle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      setTimeout(() => setParticle(null), 1000)
    }

    if (newHand.length === 0) {
      setMessage(hand === playerHand ? "You Win!" : "Computer Wins!")
      return
    }

    if (card.value === "Skip") return

    setCurrentPlayer(currentPlayer === "player" ? "computer" : "player")
    setMessage(currentPlayer === "player" ? "Computer's turn..." : "Your turn!")
  }

  const drawCard = () => {
    if (deck.length === 0) return
    const newDeck = [...deck]
    const drawnCard = newDeck.pop()!
    setPlayerHand([...playerHand, drawnCard])
    setDeck(newDeck)
    setCurrentPlayer("computer")
    setMessage("Computer's turn...")
  }

  const computerPlay = () => {
    const topCard = discardPile[discardPile.length - 1]
    const playableCard = computerHand.find((card) => canPlayCard(card, topCard))

    if (playableCard) {
      playCard(playableCard, computerHand, setComputerHand)
    } else {
      if (deck.length > 0) {
        const newDeck = [...deck]
        const drawnCard = newDeck.pop()!
        setComputerHand([...computerHand, drawnCard])
        setDeck(newDeck)
      }
      setCurrentPlayer("player")
      setMessage("Your turn!")
    }
  }

  const handleCardPlay = (card: Card) => {
    const topCard = discardPile[discardPile.length - 1]
    if (!canPlayCard(card, topCard)) {
      setMessage("Can't play that card!")
      return
    }
    playCard(card, playerHand, setPlayerHand)
  }

  const topCard = discardPile[discardPile.length - 1]

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Your Cards" value={playerHand.length} icon={<User />} color="blue" />
      <StatDisplay label="Deck" value={deck.length} icon={<Layers />} color="amber" />
      <StatDisplay label="AI Cards" value={computerHand.length} icon={<Bot />} color="red" />
    </div>
  )

  const controls = (
    <div className="text-center">
      <p className="text-2xl font-bold text-white mb-4">{message}</p>
      <GameButton3D onClick={() => window.location.reload()} variant="secondary">
        New Game
      </GameButton3D>
    </div>
  )

  return (
    <GameLayout3D title="UNO" stats={stats} controls={controls} background="from-orange-950 via-red-950 to-orange-950">
      {particle && <ParticleBurst x={particle.x} y={particle.y} color="#fbbf24" count={25} />}

      <Board3D size="large">
        <div className="space-y-8">
          {/* Computer Hand */}
          <div className="text-center">
            <p className="text-white mb-4">Computer: {computerHand.length} cards</p>
            <div className="flex justify-center gap-1">
              {computerHand.map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 shadow-xl"
                />
              ))}
            </div>
          </div>

          {/* Game Table */}
          <div className="flex justify-center gap-8 items-center">
            <Card3D
              onClick={drawCard}
              disabled={currentPlayer !== "player"}
              color="#1f2937"
              className="w-32 h-48 flex items-center justify-center shadow-2xl border-4 border-gray-700"
            >
              <div className="text-center">
                <div className="text-6xl font-bold text-red-500 mb-2">UNO</div>
                <div className="text-white text-sm">Draw Pile</div>
              </div>
            </Card3D>

            {topCard && (
              <Card3D
                data-discard
                color={getCardColor(topCard.color)}
                className="w-36 h-52 flex flex-col items-center justify-center shadow-2xl border-4 border-white/20 transform -rotate-6"
              >
                <div className="text-white font-bold text-6xl mb-2">{topCard.value}</div>
                {topCard.color !== "wild" && <div className="text-white text-xl uppercase">{topCard.color}</div>}
              </Card3D>
            )}
          </div>

          {/* Player Hand */}
          <div className="text-center">
            <p className="text-white mb-4">Your Hand</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {playerHand.map((card) => (
                <Card3D
                  key={card.id}
                  onClick={() => handleCardPlay(card)}
                  disabled={currentPlayer !== "player"}
                  color={getCardColor(card.color)}
                  className="w-24 h-36 flex flex-col items-center justify-center font-bold shadow-2xl border-2 border-white/30"
                >
                  <div className="text-white text-4xl mb-1">{card.value}</div>
                  {card.color !== "wild" && <div className="text-white text-sm uppercase">{card.color}</div>}
                </Card3D>
              ))}
            </div>
          </div>
        </div>
      </Board3D>
    </GameLayout3D>
  )
}
