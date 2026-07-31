import type { Game } from "./types";

export interface GenreSlice {
  genre: string;
  minutes: number;
}

// Map distribution of playtime for games with multiple genres, splitting the playtime evenly across all genres.

export function computeGenreDistribution(games: Game[]): GenreSlice[] {
  const totals = new Map<string, number>();

  for (const game of games) {
    if (!game.genres || game.genres.length === 0) continue;

    const sharePerGenre = game.playtimeMinutes / game.genres.length;
    for (const genre of game.genres) {
      totals.set(genre, (totals.get(genre) ?? 0) + sharePerGenre);
    }
  }

  return Array.from(totals.entries())
    .map(([genre, minutes]) => ({ genre, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}
