import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 to-background p-4">
      <div className="max-w-2xl w-full glass-effect rounded-3xl p-8 border-2 border-red-500/30 text-center space-y-6">
        <AlertTriangle className="w-24 h-24 mx-auto text-red-500" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-red-500">Аккаунт заблокирован</h1>
          <p className="text-xl text-white/70">Ваш аккаунт был заблокирован за нарушение правил игры</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-left space-y-3">
          <h2 className="text-lg font-semibold text-red-400">Причины блокировки могут включать:</h2>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Использование читов или взлома игры
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Манипуляции с игровым состоянием
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Множественные нарушения анти-чит системы
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Злоупотребление игровыми механиками
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-white/70">
            Если вы считаете, что блокировка была выполнена по ошибке, свяжитесь с поддержкой
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/settings/help">
              <Button size="lg" variant="outline">
                Связаться с поддержкой
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg">Вернуться на главную</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
