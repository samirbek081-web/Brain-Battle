"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface InterstitialAdProps {
  isOpen: boolean
  onClose: () => void
  onAdComplete?: () => void
}

export function InterstitialAd({ isOpen, onClose, onAdComplete }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCountdown(5)
      setCanClose(false)
      trackAdImpression("interstitial", "fullscreen")

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClose(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    if (canClose) {
      onClose()
      onAdComplete?.()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 bg-gradient-to-br from-background/95 to-muted/95 backdrop-blur-xl border-2 border-primary/20">
        <div className="relative p-8">
          {/* Close button - only enabled after countdown */}
          <Button
            onClick={handleClose}
            disabled={!canClose}
            className="absolute top-4 right-4 z-50"
            variant="ghost"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Countdown display */}
          {!canClose && (
            <div className="absolute top-4 right-16 bg-primary/20 px-3 py-1 rounded-full text-sm font-medium">
              {countdown}s
            </div>
          )}

          {/* Ad content */}
          <div className="min-h-[400px] flex items-center justify-center">
            {/* Google AdSense interstitial */}
            <div className="w-full">
              <ins
                className="adsbygoogle"
                style={{ display: "block", minHeight: "400px" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INTERSTITIAL}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </div>

          {/* Skip button appears after countdown */}
          {canClose && (
            <div className="mt-6 text-center">
              <Button onClick={handleClose} size="lg" className="min-w-[200px]">
                Продолжить
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function trackAdImpression(adType: string, placement: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("ad_impressions").insert({
        user_id: user.id,
        ad_type: adType,
        ad_placement: placement,
      })
    }
  } catch (err) {
    console.error("Failed to track ad impression:", err)
  }
}
