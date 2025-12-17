"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OnlineGuard({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineModal, setShowOfflineModal] = useState(false)

  useEffect(() => {
    // Check initial connection
    setIsOnline(navigator.onLine)

    // Listen for connection changes
    const handleOnline = () => {
      console.log("[v0] Connection restored")
      setIsOnline(true)
      setShowOfflineModal(false)
    }

    const handleOffline = () => {
      console.log("[v0] Connection lost")
      setIsOnline(false)
      setShowOfflineModal(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Periodic server ping to verify connection
    const pingInterval = setInterval(async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        await fetch("/api/ping", {
          method: "GET",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!isOnline) {
          setIsOnline(true)
          setShowOfflineModal(false)
        }
      } catch (error) {
        console.error("[v0] Ping failed:", error)
        if (isOnline) {
          setIsOnline(false)
          setShowOfflineModal(true)
        }
      }
    }, 10000) // Ping every 10 seconds

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(pingInterval)
    }
  }, [isOnline])

  return (
    <>
      <Dialog open={showOfflineModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-gradient-to-br from-red-950/95 to-background/95 backdrop-blur-xl border-2 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-400 text-2xl">
              <WifiOff className="h-8 w-8" />
              Нет подключения к интернету
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 animate-pulse" />
              <p className="text-lg text-white/90">Для игры требуется подключение к интернету</p>
              <p className="text-sm text-white/70">
                Эта игра работает только онлайн. Проверьте ваше интернет-соединение и попробуйте снова.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-red-400">Проверьте:</p>
              <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                <li>Wi-Fi или мобильные данные включены</li>
                <li>Сигнал достаточно сильный</li>
                <li>Нет проблем с провайдером</li>
              </ul>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full bg-red-500 hover:bg-red-600" size="lg">
              Попробовать снова
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection status indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            isOnline
              ? "bg-green-500/20 border border-green-500/50 text-green-400"
              : "bg-red-500/20 border border-red-500/50 text-red-400"
          }`}
        >
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4 animate-pulse" />}
          <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      {children}
    </>
  )
}
