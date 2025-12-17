"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AccountSettingsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [user, setUser] = useState<any>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (!user) {
      router.push("/auth/login")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) throw error

      setMessage({ type: "success", text: "Password changed successfully!" })
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] flex items-center justify-center">
            <svg className="w-20 h-20 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("account")}</h1>
          {user && <p className="text-[#a89070]">{user.email}</p>}
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[#d4b896]">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[#d4b896]">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]">
            {loading ? t("loading") : t("changePassword")}
          </Button>
        </form>

        <div className="space-y-4">
          <GameButton onClick={handleLogout} variant="secondary" className="w-full">
            {t("logout")}
          </GameButton>

          <GameButton onClick={() => router.push("/settings")} className="w-full">
            {t("back")}
          </GameButton>
        </div>
      </div>
    </div>
  )
}
