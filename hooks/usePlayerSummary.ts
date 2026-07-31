import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/steam/fetchJson";
import type { Player } from "@/lib/steam/types";

export function usePlayerSummary(steamid?: string) {
  return useQuery({
    queryKey: ["summary", steamid],
    queryFn: () => fetchJson<Player>(`/api/steam/${steamid}/summary`),
    enabled: !!steamid,
    staleTime: 1000 * 60 * 60,
  });
}
