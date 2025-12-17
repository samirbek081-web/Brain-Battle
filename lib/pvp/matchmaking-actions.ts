"use server"

import { createClient } from "@/lib/supabase/server"

export async function joinMatchmakingQueue(gameType: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get user's rank
  const { data: rankData } = await supabase.from("mastery_ranks").select("rank_level").eq("user_id", user.id).single()

  const rankLevel = rankData?.rank_level || 1

  // Add to matchmaking queue
  const { data, error } = await supabase
    .from("matchmaking_queue")
    .insert({
      user_id: user.id,
      game_type: gameType,
      rank_level: rankLevel,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function leaveMatchmakingQueue() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("matchmaking_queue").delete().eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function findMatch() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get current user's queue entry
  const { data: myQueueEntry } = await supabase
    .from("matchmaking_queue")
    .select("*, profiles!matchmaking_queue_user_id_fkey(username, avatar_url)")
    .eq("user_id", user.id)
    .single()

  if (!myQueueEntry) {
    return { error: "Not in queue" }
  }

  // Find a match with similar rank (±1 level)
  const { data: opponents } = await supabase
    .from("matchmaking_queue")
    .select("*, profiles!matchmaking_queue_user_id_fkey(username, avatar_url)")
    .neq("user_id", user.id)
    .eq("game_type", myQueueEntry.game_type)
    .gte("rank_level", myQueueEntry.rank_level - 1)
    .lte("rank_level", myQueueEntry.rank_level + 1)
    .order("joined_at", { ascending: true })
    .limit(1)

  if (!opponents || opponents.length === 0) {
    return { match: null }
  }

  const opponent = opponents[0]

  // Create match record
  const { data: match, error: matchError } = await supabase
    .from("game_matches")
    .insert({
      game_type: myQueueEntry.game_type,
      player1_id: user.id,
      player2_id: opponent.user_id,
      match_data: {
        player1_rank: myQueueEntry.rank_level,
        player2_rank: opponent.rank_level,
      },
    })
    .select()
    .single()

  if (matchError) {
    return { error: matchError.message }
  }

  // Remove both players from queue
  await supabase.from("matchmaking_queue").delete().in("user_id", [user.id, opponent.user_id])

  return {
    match: {
      id: match.id,
      gameType: myQueueEntry.game_type,
      opponent: {
        id: opponent.user_id,
        username: opponent.profiles?.username || "Player",
        avatar: opponent.profiles?.avatar_url,
        rank: opponent.rank_level,
      },
    },
  }
}

export async function updateMatchResult(matchId: string, winnerId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Update match with winner
  const { error: matchError } = await supabase.from("game_matches").update({ winner_id: winnerId }).eq("id", matchId)

  if (matchError) {
    return { error: matchError.message }
  }

  // Get match details
  const { data: match } = await supabase.from("game_matches").select("*").eq("id", matchId).single()

  if (!match) {
    return { error: "Match not found" }
  }

  // Update both players' ranks
  const player1Won = winnerId === match.player1_id
  const player2Won = winnerId === match.player2_id

  if (player1Won || player2Won) {
    // Update winner
    const { data: winnerRank } = await supabase.from("mastery_ranks").select("*").eq("user_id", winnerId).single()

    if (winnerRank) {
      const newFragments = winnerRank.fragments + 1
      const newSubRank = newFragments >= 5 ? winnerRank.sub_rank + 1 : winnerRank.sub_rank
      const newLevel = newSubRank > 3 ? Math.min(10, winnerRank.rank_level + 1) : winnerRank.rank_level

      await supabase
        .from("mastery_ranks")
        .update({
          fragments: newFragments >= 5 ? 0 : newFragments,
          sub_rank: newSubRank > 3 ? 1 : newSubRank,
          rank_level: newLevel,
          total_wins: winnerRank.total_wins + 1,
          current_streak: winnerRank.current_streak + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", winnerId)
    }

    // Update loser
    const loserId = player1Won ? match.player2_id : match.player1_id
    const { data: loserRank } = await supabase.from("mastery_ranks").select("*").eq("user_id", loserId).single()

    if (loserRank) {
      const newFragments = loserRank.fragments > 0 ? loserRank.fragments - 1 : 0
      const newSubRank =
        loserRank.fragments === 0 && loserRank.sub_rank > 1 ? loserRank.sub_rank - 1 : loserRank.sub_rank
      const newLevel =
        loserRank.fragments === 0 && loserRank.sub_rank === 1 && loserRank.rank_level > 1
          ? loserRank.rank_level - 1
          : loserRank.rank_level

      await supabase
        .from("mastery_ranks")
        .update({
          fragments: newFragments,
          sub_rank: newSubRank,
          rank_level: newLevel,
          total_losses: loserRank.total_losses + 1,
          current_streak: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", loserId)
    }
  }

  return { success: true }
}
