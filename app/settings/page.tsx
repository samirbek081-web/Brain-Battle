"use client"

import { useRouter } from "next/navigation"
import { GameButton } from "@/components/game-button"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8">
        {/* Settings Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-[#d4b896] border-4 border-[#c9a870] flex items-center justify-center">
            <svg className="w-20 h-20 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("settingsTitle")}</h1>
        </div>

        {/* Settings Options */}
        <div className="flex flex-col gap-4">
          <GameButton onClick={() => router.push("/settings/language")}>{t("language")}</GameButton>
          <GameButton onClick={() => router.push("/settings/sound")} variant="secondary">
            {t("sound")}
          </GameButton>
          <GameButton onClick={() => router.push("/settings/account")} variant="secondary">
            {t("account")}
          </GameButton>
          <GameButton onClick={() => router.push("/settings/help")} variant="secondary">
            {t("help")}
          </GameButton>
          <GameButton variant="secondary" onClick={() => router.push("/")}>
            {t("back")}
          </GameButton>
        </div>
      </div>
    </div>
  )
}
