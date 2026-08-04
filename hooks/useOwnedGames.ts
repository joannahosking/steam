import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/steam/fetchJson";
import type { Game } from "@/lib/steam/types";

interface OwnedGamesResponse {
  games: Game[];
}

export function useOwnedGames(steamid: string) {
  return useQuery({
    queryKey: ["games", steamid],
    queryFn: async () => {
      const data = await fetchJson<OwnedGamesResponse>(`/api/steam/${steamid}`);
      return {
        games: data.games.map((game) => ({
          ...game,
          lastPlayed: game.lastPlayed ? new Date(game.lastPlayed) : null,
        })),
      };
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "private_profile")
        return false;
      return failureCount < 2;
    },
  });
}
