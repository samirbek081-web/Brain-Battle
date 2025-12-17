"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SignUpSuccessPage() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-[#d4b896] flex items-center justify-center">
            <svg className="w-12 h-12 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("checkEmail")}</h1>
          <p className="text-[#d4b896]/80">{t("checkEmailMessage")}</p>
        </div>

        <Button onClick={() => router.push("/")} className="w-full bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]">
          {t("back")}
        </Button>
      </div>
    </div>
  )
}
