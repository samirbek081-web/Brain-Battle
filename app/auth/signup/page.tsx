"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SignUpPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            username,
          },
        },
      })

      if (error) throw error

      router.push("/auth/signup-success")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-[#d4b896] tracking-wider">{t("signUp")}</h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#d4b896]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#d4b896]">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-[#2a2a2a] border-[#c9a870] text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-[#d4b896] hover:bg-[#c9a870] text-[#1a1a1a]">
            {loading ? t("loading") : t("signUp")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="w-full border-[#c9a870] text-[#d4b896]"
          >
            {t("login")}
          </Button>

          <Button type="button" variant="ghost" onClick={() => router.push("/")} className="w-full text-[#d4b896]">
            {t("back")}
          </Button>
        </form>
      </div>
    </div>
  )
}
