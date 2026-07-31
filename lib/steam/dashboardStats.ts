import type { Game } from "./types";

export interface DashboardStats {
  totalGames: number;
  totalHours: number;
  backlogPercent: number;
  playedCount: number;
  unplayedCount: number;
  mostPlayedGame: Game | null;
}

export function computeDashboardStats(games: Game[]): DashboardStats {
  const totalGames = games.length;
  const totalMinutes = games.reduce((sum, g) => sum + g.playtimeMinutes, 0);
  const unplayedCount = games.filter((g) => g.playtimeMinutes === 0).length;
  const playedCount = totalGames - unplayedCount;

  const mostPlayedGame = games.reduce<Game | null>((max, g) => {
    if (!max || g.playtimeMinutes > max.playtimeMinutes) return g;
    return max;
  }, null);

  return {
    totalGames,
    totalHours: Math.round(totalMinutes / 60),
    backlogPercent:
      totalGames === 0 ? 0 : Math.round((unplayedCount / totalGames) * 100),
    playedCount,
    unplayedCount,
    mostPlayedGame,
  };
}
