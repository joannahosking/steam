import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/steam/fetchJson";

interface GenreResult {
  appId: number;
  genres: string[] | null;
}

interface GenresResponse {
  genres: GenreResult[];
}

export function useGameGenres(steamid: string) {
  return useQuery({
    queryKey: ["genres", steamid],
    queryFn: () => fetchJson<GenresResponse>(`/api/steam/${steamid}/genres`),
    staleTime: 1000 * 60 * 60, // genres don't change so cache aggressively
  });
}
