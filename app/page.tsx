"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { AdBanner } from "@/components/ads/ad-banner"

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile(profileData)
      }
    } catch (error) {
      console.error("[v0] Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    router.push("/profile/edit")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-4xl mb-4">
        <AdBanner placement="top" className="rounded-lg overflow-hidden" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* User Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/images/chatgpt-20image-204-20-d0-b4-d0-b5-d0-ba.png"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {user && (
              <button
                onClick={handleEditProfile}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#d4b896] rounded-full flex items-center justify-center border-2 border-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">
            {profile?.username || user?.user_metadata?.username || t("username")}
          </h1>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4">
          <GameButton onClick={() => router.push("/classic")}>{t("classic")}</GameButton>
          <GameButton onClick={() => router.push("/pvp")} variant="secondary">
            {t("pvp")}
          </GameButton>
          <GameButton onClick={() => router.push("/settings")} variant="secondary">
            {t("settings")}
          </GameButton>
          {!loading && !user && (
            <GameButton onClick={() => router.push("/auth/login")} variant="secondary">
              {t("login")}
            </GameButton>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mt-4">
        <AdBanner placement="bottom" className="rounded-lg overflow-hidden" />
      </div>
    </div>
  )
}
