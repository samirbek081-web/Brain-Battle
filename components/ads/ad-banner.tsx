"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

interface AdBannerProps {
  placement: "top" | "bottom" | "sidebar"
  className?: string
}

export function AdBanner({ placement, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Track ad impression
    trackAdImpression("banner", placement)

    // Load Google AdSense
    try {
      // @ts-ignore
      if (window.adsbygoogle && adRef.current) {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error("Ad loading error:", err)
    }
  }, [placement])

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={getAdSlot(placement)}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

function getAdSlot(placement: string): string {
  // You'll need to replace these with your actual AdSense slot IDs
  const slots = {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "",
    bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
  }
  return slots[placement as keyof typeof slots] || ""
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
