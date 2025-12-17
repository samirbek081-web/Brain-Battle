import { games } from "@/lib/games/game-definitions"

export interface Player {
  id: string
  name: string
  rank: number
  stage: number
  socketId?: string
}

export interface MatchmakingQueue {
  player: Player
  timestamp: number
}

export interface Match {
  id: string
  player1: Player
  player2: Player
  gameId: string
  status: "waiting" | "playing" | "finished"
  winnerId?: string
}

// In a real app, this would be managed by a WebSocket server
let matchmakingQueue: MatchmakingQueue[] = []
const activeMatches: Match[] = []

export function joinQueue(player: Player): void {
  matchmakingQueue.push({
    player,
    timestamp: Date.now(),
  })
}

export function leaveQueue(playerId: string): void {
  matchmakingQueue = matchmakingQueue.filter((q) => q.player.id !== playerId)
}

export function findMatch(player: Player): Match | null {
  // Find opponent with similar rank (within 2 ranks)
  const opponent = matchmakingQueue.find(
    (q) => q.player.id !== player.id && Math.abs(q.player.rank - player.rank) <= 2 && Date.now() - q.timestamp < 60000, // Within last minute
  )

  if (!opponent) return null

  // Remove both players from queue
  matchmakingQueue = matchmakingQueue.filter((q) => q.player.id !== player.id && q.player.id !== opponent.player.id)

  // Pick random game
  const availableGames = games.filter((g) => g.implemented)
  const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)]

  const match: Match = {
    id: `match-${Date.now()}-${Math.random()}`,
    player1: player,
    player2: opponent.player,
    gameId: randomGame.id,
    status: "waiting",
  }

  activeMatches.push(match)
  return match
}

export function getMatch(matchId: string): Match | undefined {
  return activeMatches.find((m) => m.id === matchId)
}

export function updateMatchStatus(matchId: string, status: Match["status"], winnerId?: string): void {
  const match = activeMatches.find((m) => m.id === matchId)
  if (match) {
    match.status = status
    if (winnerId) match.winnerId = winnerId
  }
}
