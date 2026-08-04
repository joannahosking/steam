import type { Game } from "./types";
import type { GenreSlice } from "./genreDistribution";

export interface PlayNextSuggestion {
  game: Game;
  matchedGenres: string[];
}

export function computePlayNextSuggestions(
  games: Game[],
  genreDistribution: GenreSlice[],
  limit = 5,
): PlayNextSuggestion[] {
  //Rank genres by their distribution
  const genreRank = new Map(
    genreDistribution.map((slice, index) => [
      slice.genre,
      genreDistribution.length - index,
    ]),
  );

  const unplayed = games.filter(
    (g) => g.playtimeMinutes === 0 && g.genres && g.genres.length > 0,
  );

  const scored = unplayed.map((game) => {
    const matchedGenres = game.genres!.filter((g) => genreRank.has(g));
    const score = matchedGenres.reduce(
      (sum, g) => sum + (genreRank.get(g) ?? 0),
      0,
    );
    return { game, matchedGenres, score };
  });

  return scored
    .filter((s) => s.score > 0) // don't be random
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ game, matchedGenres }) => ({ game, matchedGenres }));
}
