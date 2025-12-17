"use client"

export class AdManager {
  private static gamesPlayedSinceLastAd = 0
  private static readonly AD_FREQUENCY = 3 // Show ad every 3 games

  static shouldShowAd(): boolean {
    this.gamesPlayedSinceLastAd++

    if (this.gamesPlayedSinceLastAd >= this.AD_FREQUENCY) {
      this.gamesPlayedSinceLastAd = 0
      return true
    }

    return false
  }

  static resetCounter() {
    this.gamesPlayedSinceLastAd = 0
  }

  static loadAdScript() {
    if (typeof window !== "undefined" && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script")
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
      script.async = true
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }
  }
}
