import type { Game } from "./types";

interface GenreResult {
  appId: number;
  genres: string[] | null;
}

export function mergeGenresIntoGames(
  games: Game[],
  genreResults: GenreResult[],
): Game[] {
  const genreMap = new Map(genreResults.map((g) => [g.appId, g.genres]));
  return games.map((game) => ({
    ...game,
    genres: genreMap.get(game.appId) ?? null,
  }));
}
