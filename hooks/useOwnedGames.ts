import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/steam/fetchJson";
import type { Game } from "@/lib/steam/types";

interface OwnedGamesResponse {
  games: Game[];
}

export function useOwnedGames(steamid: string) {
  return useQuery({
    queryKey: ["games", steamid],
    queryFn: () => fetchJson<OwnedGamesResponse>(`/api/steam/${steamid}`),
    retry: (failureCount, error) => {
      // Don't retry a private profile
      if (error instanceof Error && error.message === "private_profile")
        return false;
      return failureCount < 2;
    },
  });
}
