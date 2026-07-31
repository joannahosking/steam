import { getOwnedGames } from "@/lib/steam/getOwnedGames";
import { fetchGenres } from "@/lib/steam/fetchGenres";
import { mapWithConcurrency } from "@/lib/concurrency";
import { getCachedGenres, setCachedGenres } from "@/lib/steam/genresCache";
import type { Game } from "@/lib/steam/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ steamid: string }> },
) {
  const { steamid } = await params;
  const games = await getOwnedGames(steamid);
  const playedGames = games.filter((g) => g.playtimeMinutes > 0);

  const genres = await mapWithConcurrency(playedGames, 4, async (game: Game) => {
    const cached = getCachedGenres(game.name);
    if (cached !== undefined) return { appId: game.appId, genre: cached };

    const genres = await fetchGenres(game.name);
    setCachedGenres(game.name, genres);
    return { appId: game.appId, genres };
  });

  return Response.json({ genres });
}
