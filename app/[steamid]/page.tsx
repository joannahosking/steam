"use client";

import { use, useMemo } from "react";
import { useOwnedGames } from "@/hooks/useOwnedGames";
import { useGameGenres } from "@/hooks/useGameGenres";
import { usePlayerSummary } from "@/hooks/usePlayerSummary";
import { ApiError } from "@/lib/steam/fetchJson";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { MostPlayedCard } from "@/components/dashboard/MostPlayedCard";
import { BacklogProgress } from "@/components/dashboard/BacklogProgress";
import { PlaytimeHistogram } from "@/components/dashboard/PlaytimeHistogram";
import { computePlaytimeHistogram } from "@/lib/steam/playtimeHistogram";
import { computeDashboardStats } from "@/lib/steam/dashboardStats";
import { mergeGenresIntoGames } from "@/lib/steam/mergeGenres";
import { computeGenreDistribution } from "@/lib/steam/genreDistribution";
import { GenreChart } from "@/components/dashboard/GenreChart";
import { GamesTable } from "@/components/dashboard/GamesTable";
import { computePlayNextSuggestions } from "@/lib/steam/playNext";
import { PlayNextList } from "@/components/dashboard/PlayNextList";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ steamid: string }>;
}

export default function DashboardPage({ params }: PageProps) {
  const { steamid } = use(params);

  const gamesQuery = useOwnedGames(steamid);
  const genresQuery = useGameGenres(steamid);
  const summaryQuery = usePlayerSummary(steamid);

  const stats = useMemo(() => {
    if (!gamesQuery.data) return null;
    return computeDashboardStats(gamesQuery.data.games);
  }, [gamesQuery.data]);

  const enrichedGames = useMemo(() => {
    if (!gamesQuery.data || !genresQuery.data) return null;
    return mergeGenresIntoGames(gamesQuery.data.games, genresQuery.data.genres);
  }, [gamesQuery.data, genresQuery.data]);

  const genreDistribution = useMemo(() => {
    if (!enrichedGames) return [];
    return computeGenreDistribution(enrichedGames);
  }, [enrichedGames]);

  const playNextSuggestions = useMemo(() => {
    if (!enrichedGames) return [];
    return computePlayNextSuggestions(enrichedGames, genreDistribution);
  }, [enrichedGames, genreDistribution]);

  if (gamesQuery.isError) {
    if (
      gamesQuery.error instanceof ApiError &&
      gamesQuery.error.code === "private_profile"
    ) {
      return (
        <div className={styles.error}>
          This Steam profile is private. Ask the owner to set "Game details" to
          Public.
        </div>
      );
    }
    return (
      <div className={styles.error}>
        Something went wrong loading this library.
      </div>
    );
  }

  return (
    <main>
      <div className={styles.dashboard}>
        <div className={styles.headerArea}>
          <ProfileHeader
            player={summaryQuery.data}
            isLoading={summaryQuery.isPending}
            totalGames={stats?.totalGames ?? 0}
            totalHours={stats?.totalHours ?? 0}
            backlogPercent={stats?.backlogPercent ?? 0}
            statsLoading={gamesQuery.isPending}
          />
        </div>

        <div className={styles.mainColumn}>
          <PlaytimeHistogram
            data={
              gamesQuery.data
                ? computePlaytimeHistogram(gamesQuery.data.games)
                : []
            }
            isLoading={gamesQuery.isPending}
          />

          <GamesTable
            games={enrichedGames ?? gamesQuery.data?.games ?? []}
            genresLoading={genresQuery.isPending}
          />
        </div>

        <div className={styles.sidebarColumn}>
          <MostPlayedCard
            game={stats?.mostPlayedGame ?? null}
            isLoading={gamesQuery.isPending}
          />
          <BacklogProgress
            playedCount={stats?.playedCount ?? 0}
            unplayedCount={stats?.unplayedCount ?? 0}
            backlogPercent={stats?.backlogPercent ?? 0}
            isLoading={gamesQuery.isPending}
          />

          <GenreChart
            data={genreDistribution}
            isLoading={genresQuery.isPending || !enrichedGames}
          />

          <PlayNextList
            suggestions={playNextSuggestions}
            isLoading={genresQuery.isPending || !enrichedGames}
          />
        </div>
      </div>
    </main>
  );
}
