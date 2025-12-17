"use client"

import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/use-translation"
import { languages, type LanguageCode } from "@/lib/i18n/config"

export default function LanguageSettingsPage() {
  const router = useRouter()
  const { t, language, setLanguage } = useTranslation()

  return (
    <div className="min-h-screen p-4 bg-[#1a1a1a]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push("/settings")}
            className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
          >
            <svg className="w-6 h-6 text-[#d4b896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("language")}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={`p-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                language === lang.code
                  ? "bg-[#d4b896] text-[#1a1a1a]"
                  : "bg-[#2a2a2a] text-[#d4b896] hover:bg-[#3a3a3a] border-2 border-[#3a3a3a]"
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-[#8a7a6a]">
          <p className="text-sm">Supports 150+ languages</p>
          <p className="text-xs mt-1">More languages coming soon</p>
        </div>
      </div>
    </div>
  )
}
