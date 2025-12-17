"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SoundSettingsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const [musicVolume, setMusicVolume] = useState(80)
  const [soundVolume, setSoundVolume] = useState(80)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

        if (data) {
          setMusicVolume(data.music_volume)
          setSoundVolume(data.sound_volume)
          setMusicEnabled(data.music_enabled)
          setSoundEnabled(data.sound_enabled)
          setVibrationEnabled(data.vibration_enabled)
        }
      }
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from("user_settings")
          .upsert({
            user_id: user.id,
            music_volume: musicVolume,
            sound_volume: soundVolume,
            music_enabled: musicEnabled,
            sound_enabled: soundEnabled,
            vibration_enabled: vibrationEnabled,
            updated_at: new Date().toISOString(),
          })
          .select()
      }
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
    }
  }

  useEffect(() => {
    if (!loading) {
      saveSettings()
    }
  }, [musicVolume, soundVolume, musicEnabled, soundEnabled, vibrationEnabled])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] flex items-center justify-center">
            <svg className="w-20 h-20 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("soundSettings")}</h1>
        </div>

        <div className="space-y-6">
          {/* Music Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[#d4b896]">{t("musicVolume")}</Label>
              <span className="text-[#d4b896] font-bold">{musicVolume}%</span>
            </div>
            <Slider
              value={[musicVolume]}
              onValueChange={(value) => setMusicVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Enable Music Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl">
            <Label htmlFor="music-enabled" className="text-[#d4b896]">
              {t("enableMusic")}
            </Label>
            <Switch id="music-enabled" checked={musicEnabled} onCheckedChange={setMusicEnabled} />
          </div>

          {/* Sound Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[#d4b896]">{t("soundVolume")}</Label>
              <span className="text-[#d4b896] font-bold">{soundVolume}%</span>
            </div>
            <Slider
              value={[soundVolume]}
              onValueChange={(value) => setSoundVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Enable Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl">
            <Label htmlFor="sound-enabled" className="text-[#d4b896]">
              {t("enableSound")}
            </Label>
            <Switch id="sound-enabled" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          {/* Enable Vibration Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl">
            <Label htmlFor="vibration-enabled" className="text-[#d4b896]">
              {t("enableVibration")}
            </Label>
            <Switch id="vibration-enabled" checked={vibrationEnabled} onCheckedChange={setVibrationEnabled} />
          </div>

          <GameButton onClick={() => router.push("/settings")} className="w-full">
            {t("back")}
          </GameButton>
        </div>
      </div>
    </div>
  )
}
