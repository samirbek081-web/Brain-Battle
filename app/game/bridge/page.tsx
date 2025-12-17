"use client"

import { useState } from "react"
import { GameLayout3D } from "@/components/game-3d/game-layout-3d"
import { Board3D } from "@/components/game-3d/board-3d"
import { Card3D } from "@/components/game-3d/card-3d"
import { GameButton3D } from "@/components/game-3d/game-button-3d"
import { StatDisplay } from "@/components/game-3d/stat-display"
import { Trophy, Target, Users } from "lucide-react"

export default function BridgePage() {
  const [biddingPhase, setBiddingPhase] = useState(true)
  const [currentBid, setCurrentBid] = useState<string | null>(null)
  const [tricks, setTricks] = useState({ ns: 0, ew: 0 })
  const [contract, setContract] = useState<string | null>(null)

  const bids = ["1♣", "1♦", "1♥", "1♠", "1NT", "2♣", "2♦", "2♥", "2♠", "2NT", "3♣", "3♦", "3♥", "3♠", "3NT"]

  const makeBid = (bid: string) => {
    setCurrentBid(bid)
    setContract(bid)
  }

  const pass = () => {
    if (currentBid) {
      setBiddingPhase(false)
    }
  }

  const stats = (
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="N-S Tricks" value={tricks.ns} icon={<Trophy />} color="blue" />
      <StatDisplay label="Contract" value={contract || "None"} icon={<Target />} color="amber" />
      <StatDisplay label="E-W Tricks" value={tricks.ew} icon={<Users />} color="red" />
    </div>
  )

  const controls = (
    <div className="flex gap-4 justify-center">
      <GameButton3D onClick={() => window.location.reload()} variant="primary">
        New Game
      </GameButton3D>
      <GameButton3D onClick={() => (window.location.href = "/classic")} variant="secondary">
        Back to Menu
      </GameButton3D>
    </div>
  )

  return (
    <GameLayout3D
      title="Contract Bridge"
      stats={stats}
      controls={controls}
      background="from-blue-950 via-indigo-950 to-blue-950"
    >
      <Board3D size="large">
        {biddingPhase ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bidding Phase</h2>
              {currentBid && <p className="text-xl text-amber-400">Current Bid: {currentBid}</p>}
            </div>

            <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
              {bids.map((bid) => {
                const isRed = bid.includes("♥") || bid.includes("♦")
                return (
                  <Card3D
                    key={bid}
                    onClick={() => makeBid(bid)}
                    color={isRed ? "#dc2626" : "#1f2937"}
                    className="aspect-square flex items-center justify-center font-bold text-2xl shadow-xl border-2 border-white/20"
                  >
                    <span className={isRed ? "text-white" : "text-white"}>{bid}</span>
                  </Card3D>
                )
              })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <GameButton3D onClick={pass} variant="secondary">
                Pass
              </GameButton3D>
              <GameButton3D onClick={() => makeBid("Double")} variant="danger">
                Double
              </GameButton3D>
              <GameButton3D onClick={() => makeBid("Redouble")} variant="success">
                Redouble
              </GameButton3D>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Playing Phase</h2>
              <p className="text-xl text-amber-400">Contract: {contract}</p>
            </div>

            <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
              {/* North */}
              <div className="col-span-4 flex justify-center">
                <div className="text-center">
                  <p className="text-white mb-2">North</p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700" />
                    ))}
                  </div>
                </div>
              </div>

              {/* West */}
              <div className="col-span-1 flex items-center">
                <div className="text-center">
                  <p className="text-white mb-2">West</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Center */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="w-64 h-64 bg-green-900/50 rounded-full border-4 border-amber-500 flex items-center justify-center">
                  <p className="text-white text-2xl">Trick Area</p>
                </div>
              </div>

              {/* East */}
              <div className="col-span-1 flex items-center justify-end">
                <div className="text-center">
                  <p className="text-white mb-2">East</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700" />
                    ))}
                  </div>
                </div>
              </div>

              {/* South (Player) */}
              <div className="col-span-4 flex justify-center">
                <div className="text-center">
                  <p className="text-white mb-2">South (You)</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card3D
                        key={i}
                        color="#ffffff"
                        className="w-20 h-28 flex items-center justify-center text-2xl font-bold shadow-xl border-2 border-amber-500"
                      >
                        <span className="text-red-600">K♥</span>
                      </Card3D>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Board3D>
    </GameLayout3D>
  )
}
