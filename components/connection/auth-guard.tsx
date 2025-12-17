"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isUserBanned } from "@/lib/security/anti-cheat"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (requireAuth && !user) {
        router.push("/auth/login")
        return
      }

      if (user) {
        // Check if user is banned
        const banned = await isUserBanned(user.id)
        if (banned) {
          router.push("/banned")
          return
        }
      }

      setAuthorized(true)
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
      if (requireAuth) {
        router.push("/auth/login")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#d4b896] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#d4b896] text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
