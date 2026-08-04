import { getOwnedGames } from "@/lib/steam/getOwnedGames";
import { resolveGenres } from "@/lib/steam/resolveGenres";
import { mapWithConcurrency } from "@/lib/concurrency";
import type { Game } from "@/lib/steam/types";

const MAX_PLAYED_TO_ENRICH = 20;
const MAX_UNPLAYED_TO_ENRICH = 20;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ steamid: string }> },
) {
  const { steamid } = await params;
  const games = await getOwnedGames(steamid);

  const playedTop = games
    .filter((g) => g.playtimeMinutes > 0)
    .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
    .slice(0, MAX_PLAYED_TO_ENRICH);

  const unplayedSample = games
    .filter((g) => g.playtimeMinutes === 0)
    .slice(0, MAX_UNPLAYED_TO_ENRICH);

  const gamesToEnrich = [...playedTop, ...unplayedSample];

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
