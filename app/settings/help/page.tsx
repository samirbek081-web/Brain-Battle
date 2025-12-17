"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate sending email (in production, use an API route)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setMessage("")

      // Open email client
      window.location.href = `mailto:samirbekhamroqulov7@gmail.com?subject=BrainBattle Support&body=${encodeURIComponent(message)}`
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] flex items-center justify-center">
            <svg className="w-20 h-20 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("help")}</h1>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#d4b896] mx-auto flex items-center justify-center">
              <svg className="w-12 h-12 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#d4b896]">{t("messageSent")}</p>
            <Button onClick={() => setSent(false)} className="bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]">
              {t("sendMessage")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#d4b896]">
                {t("contactSupport")}
              </Label>
              <div className="text-sm text-[#a89070] mb-2">samirbekhamroqulov7@gmail.com</div>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("yourMessage")}
                rows={6}
                required
                className="bg-[#2a2a2a] border-[#c9a870] text-white resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]"
            >
              {loading ? t("loading") : t("sendMessage")}
            </Button>
          </form>
        )}

        <GameButton onClick={() => router.push("/settings")} variant="secondary" className="w-full">
          {t("back")}
        </GameButton>
      </div>
    </div>
  )
}
