"use server"

import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export interface GameMove {
  type: string
  data: any
  timestamp: number
}

export interface GameState {
  moves: GameMove[]
  score?: number
  [key: string]: any
}

// Generate checksum for game state integrity
export function generateChecksum(gameState: GameState, sessionToken: string): string {
  const data = JSON.stringify(gameState) + sessionToken + process.env.ANTI_CHEAT_SECRET!
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Verify game state hasn't been tampered with
export async function verifyGameIntegrity(sessionId: string, gameState: GameState, checksum: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: session } = await supabase.from("game_sessions").select("session_token").eq("id", sessionId).single()

  if (!session) return false

  const expectedChecksum = generateChecksum(gameState, session.session_token)
  return expectedChecksum === checksum
}

// Check for impossible moves or timing violations
export async function validateGameMove(
  sessionId: string,
  move: GameMove,
  previousState: GameState,
): Promise<{ valid: boolean; reason?: string }> {
  const supabase = await createClient()

  // Check timing - moves shouldn't be too fast (bot detection)
  const lastMove = previousState.moves[previousState.moves.length - 1]
  if (lastMove && move.timestamp - lastMove.timestamp < 100) {
    // Less than 100ms between moves
    await logCheatAttempt(sessionId, "timing_violation", {
      timeDiff: move.timestamp - lastMove.timestamp,
      move,
    })
    return { valid: false, reason: "Moves too fast" }
  }

  // Check for state manipulation
  const { data: session } = await supabase.from("game_sessions").select("move_history").eq("id", sessionId).single()

  if (session && session.move_history) {
    const expectedMoveCount = session.move_history.length
    const actualMoveCount = previousState.moves.length

    if (actualMoveCount !== expectedMoveCount) {
      await logCheatAttempt(sessionId, "state_manipulation", {
        expected: expectedMoveCount,
        actual: actualMoveCount,
      })
      return { valid: false, reason: "Invalid move history" }
    }
  }

  return { valid: true }
}

// Log cheat attempts
async function logCheatAttempt(sessionId: string, violationType: string, details: any) {
  const supabase = await createClient()

  const { data: session } = await supabase.from("game_sessions").select("user_id").eq("id", sessionId).single()

  if (!session) return

  const severity =
    violationType === "timing_violation" ? "low" : violationType === "state_manipulation" ? "high" : "medium"

  await supabase.from("anti_cheat_logs").insert({
    user_id: session.user_id,
    game_session_id: sessionId,
    violation_type: violationType,
    details,
    severity,
  })

  // Check if user should be banned
  const { data: violations } = await supabase
    .from("anti_cheat_logs")
    .select("*")
    .eq("user_id", session.user_id)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

  if (violations && violations.length >= 5) {
    // 5+ violations in 24h = ban
    await supabase.from("user_bans").insert({
      user_id: session.user_id,
      reason: "Multiple anti-cheat violations",
      banned_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
  }
}

// Check if user is banned
export async function isUserBanned(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: ban } = await supabase
    .from("user_bans")
    .select("*")
    .eq("user_id", userId)
    .or(`is_permanent.eq.true,banned_until.gt.${new Date().toISOString()}`)
    .single()

  return !!ban
}
