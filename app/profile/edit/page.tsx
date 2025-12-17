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

// Avatar options
const AVATAR_OPTIONS = [
  "/placeholder-user.jpg",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
  "https://api.dicebear.com/7.x/bottts/svg?seed=1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=2",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=1",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=2",
]

export default function EditProfilePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [customAvatarUrl, setCustomAvatarUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setUsername(profile.username || "")
        setSelectedAvatar(profile.avatar_url || "")
      } else {
        setUsername(user.user_metadata?.username || "")
      }
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const avatarUrl = customAvatarUrl || selectedAvatar

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("editProfile")}</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#d4b896]">
              {t("username")}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-4">
            <Label className="text-[#d4b896]">Select Avatar</Label>
            <div className="grid grid-cols-4 gap-4">
              {AVATAR_OPTIONS.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(avatar)
                    setCustomAvatarUrl("")
                  }}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-4 transition-all ${
                    selectedAvatar === avatar ? "border-[#d4b896] scale-110" : "border-[#2a2a2a] hover:border-[#c9a870]"
                  }`}
                >
                  <img
                    src={avatar || "/placeholder.svg"}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="custom-avatar" className="text-[#d4b896]">
              Or paste custom image URL
            </Label>
            <Input
              id="custom-avatar"
              type="url"
              value={customAvatarUrl}
              onChange={(e) => {
                setCustomAvatarUrl(e.target.value)
                setSelectedAvatar("")
              }}
              placeholder="https://example.com/avatar.png"
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          {/* Preview */}
          {(selectedAvatar || customAvatarUrl) && (
            <div className="flex flex-col items-center gap-2">
              <Label className="text-[#d4b896]">Preview</Label>
              <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] overflow-hidden">
                <img
                  src={customAvatarUrl || selectedAvatar}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-user.jpg"
                  }}
                />
              </div>
            </div>
          )}

          {message && (
            <p className={`text-sm text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]">
              {loading ? t("loading") : "Save Changes"}
            </Button>
            <GameButton onClick={() => router.push("/")} variant="secondary" className="flex-1">
              {t("back")}
            </GameButton>
          </div>
        </form>
      </div>
    </div>
  )
}
