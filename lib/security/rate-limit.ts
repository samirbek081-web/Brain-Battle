"use server"

import { createClient } from "@/lib/supabase/server"

const RATE_LIMITS = {
  game_start: { maxCount: 50, windowMs: 60 * 60 * 1000 }, // 50 games per hour
  matchmaking_join: { maxCount: 100, windowMs: 60 * 60 * 1000 }, // 100 joins per hour
  api_call: { maxCount: 1000, windowMs: 60 * 60 * 1000 }, // 1000 API calls per hour
  profile_update: { maxCount: 10, windowMs: 60 * 60 * 1000 }, // 10 updates per hour
}

export async function checkRateLimit(userId: string, actionType: keyof typeof RATE_LIMITS): Promise<boolean> {
  const supabase = await createClient()

  const limit = RATE_LIMITS[actionType]
  const windowStart = new Date(Date.now() - limit.windowMs)

  // Get or create rate limit entry
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("user_id", userId)
    .eq("action_type", actionType)
    .single()

  if (!existing) {
    // First action, create entry
    await supabase.from("rate_limits").insert({
      user_id: userId,
      action_type: actionType,
      count: 1,
      window_start: new Date(),
    })
    return true
  }

  // Check if window has expired
  if (new Date(existing.window_start) < windowStart) {
    // Reset counter
    await supabase
      .from("rate_limits")
      .update({
        count: 1,
        window_start: new Date(),
      })
      .eq("user_id", userId)
      .eq("action_type", actionType)
    return true
  }

  // Check if limit exceeded
  if (existing.count >= limit.maxCount) {
    return false
  }

  // Increment counter
  await supabase
    .from("rate_limits")
    .update({
      count: existing.count + 1,
    })
    .eq("user_id", userId)
    .eq("action_type", actionType)

  return true
}
