import { getOwnedGames } from "@/lib/steam/getOwnedGames";
import { resolveGenres } from "@/lib/steam/resolveGenres";
import { mapWithConcurrency } from "@/lib/concurrency";
import type { Game } from "@/lib/steam/types";

const MAX_GAMES_TO_ENRICH = 30;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ steamid: string }> },
) {
  const { steamid } = await params;
  const games = await getOwnedGames(steamid);

  const gamesToEnrich = games
    .filter((g) => g.playtimeMinutes > 0)
    .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
    .slice(0, MAX_GAMES_TO_ENRICH);

  const genres = await mapWithConcurrency(
    gamesToEnrich,
    4,
    async (game: Game) => ({
      appId: game.appId,
      genres: await resolveGenres(game),
    }),
  );

  return Response.json({ genres });
}
