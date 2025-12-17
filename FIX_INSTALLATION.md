# Исправление ошибки установки

## Проблема
При запуске `pnpm dev` возникает ошибка: `Module not found: Can't resolve '@supabase/ssr'`

## Решение

### Шаг 1: Удалите node_modules и lock файлы
```bash
# В командной строке Windows выполните:
cd "C:\Brain Battle"
rmdir /s /q node_modules
del pnpm-lock.yaml
```

### Шаг 2: Переустановите зависимости
```bash
pnpm install
```

### Шаг 3: Запустите проект
```bash
pnpm dev
```

## Что было исправлено

1. Добавлен пакет `@supabase/supabase-js` версии 2.49.2 в dependencies
2. Переупорядочены зависимости для корректной установки
3. Пакет `@supabase/ssr` уже был в списке, но не был корректно установлен

## Если ошибка повторяется

Попробуйте использовать npm вместо pnpm:

```bash
# Удалите pnpm зависимости
rmdir /s /q node_modules
del pnpm-lock.yaml

# Установите через npm
npm install

# Запустите проект
npm run dev
```

## Переменные окружения

Убедитесь, что у вас настроены следующие переменные окружения в файле `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Для рекламы (опционально)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_client_id

# Для разработки
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Дополнительные команды

Если нужно полностью очистить кэш:

```bash
# Очистка Next.js кэша
rmdir /s /q .next

# Полная переустановка
rmdir /s /q node_modules
del pnpm-lock.yaml
pnpm install
pnpm dev
