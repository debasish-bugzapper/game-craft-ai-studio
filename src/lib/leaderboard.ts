export interface ScoreEntry {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  timestamp: string;
}

export const mockLeaderboard: ScoreEntry[] = [];

export function submitGameScore(gameId: string, playerName: string, score: number): ScoreEntry {
  const newEntry: ScoreEntry = {
    id: `score_${Date.now()}`,
    gameId,
    playerName: playerName || 'Anonymous Gamer',
    score,
    timestamp: new Date().toISOString()
  };
  mockLeaderboard.push(newEntry);
  return newEntry;
}

export function getLeaderboardForGame(gameId: string): ScoreEntry[] {
  return mockLeaderboard
    .filter(entry => entry.gameId === gameId)
    .sort((a, b) => b.score - a.score);
}
