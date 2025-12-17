"use server"

import { createClient } from "@/lib/supabase/server"
import { generateChecksum, validateGameMove, isUserBanned, type GameState } from "./anti-cheat"
import { checkRateLimit } from "./rate-limit"
import crypto from "crypto"

export async function startGameSession(gameType: string, difficulty?: string, opponentId?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is banned
  const banned = await isUserBanned(user.id)
  if (banned) {
    return { error: "Account is banned for violating game rules" }
  }

  // Check rate limit
  const allowed = await checkRateLimit(user.id, "game_start")
  if (!allowed) {
    return { error: "Too many games started. Please wait before starting a new game." }
  }

  // Generate session token
  const sessionToken = crypto.randomBytes(32).toString("hex")

  // Initialize game state
  const initialState: GameState = {
    moves: [],
    gameType,
    difficulty,
    opponentId,
  }

  const checksum = generateChecksum(initialState, sessionToken)

  // Create session
  const { data: session, error } = await supabase
    .from("game_sessions")
    .insert({
      user_id: user.id,
      game_type: gameType,
      session_token: sessionToken,
      game_state: initialState,
      opponent_id: opponentId,
      difficulty,
      checksum,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { session }
}

export async function submitGameMove(sessionId: string, move: any, newGameState: GameState) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get session
  const { data: session } = await supabase.from("game_sessions").select("*").eq("id", sessionId).single()

  if (!session) {
    return { error: "Session not found" }
  }

  if (session.user_id !== user.id) {
    return { error: "Unauthorized" }
  }

  if (!session.is_active) {
    return { error: "Session is not active" }
  }

  // Validate move
  const validation = await validateGameMove(sessionId, move, session.game_state)
  if (!validation.valid) {
    return { error: validation.reason }
  }

  // Generate new checksum
  const checksum = generateChecksum(newGameState, session.session_token)

  // Update session
  const { error } = await supabase
    .from("game_sessions")
    .update({
      game_state: newGameState,
      move_history: [...(session.move_history || []), move],
      last_activity: new Date().toISOString(),
      checksum,
    })
    .eq("id", sessionId)

  if (error) {
    return { error: error.message }
  }

  return { success: true, checksum }
}

export async function endGameSession(sessionId: string, result: "win" | "loss" | "draw") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get session
  const { data: session } = await supabase.from("game_sessions").select("*").eq("id", sessionId).single()

  if (!session) {
    return { error: "Session not found" }
  }

  if (session.user_id !== user.id) {
    return { error: "Unauthorized" }
  }

  // Mark session as inactive
  await supabase.from("game_sessions").update({ is_active: false }).eq("id", sessionId)

  // Update stats if PvP game
  if (session.opponent_id && result !== "draw") {
    const winnerId = result === "win" ? user.id : session.opponent_id
    await updateMatchResult(sessionId, winnerId)
  }

  return { success: true }
}

async function updateMatchResult(sessionId: string, winnerId: string) {
  // This function would update mastery ranks similar to matchmaking-actions.ts
  // Implementation omitted for brevity
}
