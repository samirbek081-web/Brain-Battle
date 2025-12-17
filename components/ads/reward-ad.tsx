"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Gift, Play } from "lucide-react"

interface RewardAdProps {
  rewardType: "coins" | "fragments" | "boost"
  rewardAmount: number
  onRewardClaimed: () => void
}

export function RewardAd({ rewardType, rewardAmount, onRewardClaimed }: RewardAdProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  const handleWatchAd = () => {
    setIsWatching(true)

    // Simulate ad watching (in production, integrate with actual ad network)
    setTimeout(() => {
      setIsWatching(false)
      setRewardClaimed(true)
      onRewardClaimed()
    }, 15000) // 15 second ad
  }

  const rewardText = {
    coins: `${rewardAmount} монет`,
    fragments: `${rewardAmount} фрагментов`,
    boost: "Бонусный буст",
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2" variant="outline">
        <Gift className="h-4 w-4" />
        Получить награду
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Награда за просмотр рекламы</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!isWatching && !rewardClaimed && (
              <>
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎁</div>
                  <p className="text-lg font-semibold">Получите {rewardText[rewardType]}</p>
                  <p className="text-sm text-muted-foreground">Посмотрите 15-секундную рекламу</p>
                </div>

                <Button onClick={handleWatchAd} size="lg" className="w-full gap-2">
                  <Play className="h-5 w-5" />
                  Смотреть рекламу
                </Button>
              </>
            )}

            {isWatching && (
              <div className="text-center space-y-4">
                <div className="animate-pulse text-4xl">📺</div>
                <p className="text-lg">Просмотр рекламы...</p>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full animate-[progress_15s_linear]" />
                </div>
              </div>
            )}

            {rewardClaimed && (
              <div className="text-center space-y-4">
                <div className="text-4xl">✅</div>
                <p className="text-lg font-semibold text-green-500">Награда получена!</p>
                <p>Вы получили {rewardText[rewardType]}</p>
                <Button onClick={() => setIsOpen(false)} size="lg" className="w-full">
                  Отлично!
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
