export type DifficultyLevel = "easy" | "medium" | "hard" | "expert"

export interface AIConfig {
  level: DifficultyLevel
  thinkingTime: number // ms
  errorRate: number // 0-1, probability of making suboptimal moves
  lookAheadDepth: number // how many moves to look ahead
}

export const AI_CONFIGS: Record<DifficultyLevel, AIConfig> = {
  easy: {
    level: "easy",
    thinkingTime: 500,
    errorRate: 0.4,
    lookAheadDepth: 1,
  },
  medium: {
    level: "medium",
    thinkingTime: 1000,
    errorRate: 0.2,
    lookAheadDepth: 2,
  },
  hard: {
    level: "hard",
    thinkingTime: 1500,
    errorRate: 0.05,
    lookAheadDepth: 3,
  },
  expert: {
    level: "expert",
    thinkingTime: 2000,
    errorRate: 0.01,
    lookAheadDepth: 4,
  },
}

export function getAIConfig(level: DifficultyLevel): AIConfig {
  return AI_CONFIGS[level]
}
