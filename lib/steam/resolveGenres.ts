import { fetchGenreFromSteamStore } from "./fetchGenreFromSteamStore";
import { fetchGenresFromRawg } from "./fetchGenresFromRawg";
import { getCachedGenres, setCachedGenres } from "./genreCache";
import type { Game } from "./types";

export async function resolveGenres(game: Game): Promise<string[] | null> {
  const cached = getCachedGenres(game.appId);
  if (cached !== undefined) return cached;

  const steamResult = await fetchGenreFromSteamStore(game.appId);
  if (steamResult) {
    setCachedGenres(game.appId, steamResult);
    return steamResult;
  }

  // try RAWG if Steam didn't have any genre data for this game or rate limited us
  const rawgResult = await fetchGenresFromRawg(game.name);
  setCachedGenres(game.appId, rawgResult); // cache even a null result, so we don't retry both providers every time for a game neither has data on
  return rawgResult;
}
