"use client";

import { use, useMemo } from "react";
import { useOwnedGames } from "@/hooks/useOwnedGames";
import { useGameGenres } from "@/hooks/useGameGenres";
import { usePlayerSummary } from "@/hooks/usePlayerSummary";
import { ApiError } from "@/lib/steam/fetchJson";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { BacklogProgress } from "@/components/dashboard/BacklogProgress";
import { PlaytimeHistogram } from "@/components/dashboard/PlaytimeHistogram";
import { computePlaytimeHistogram } from "@/lib/steam/playtimeHistogram";
import { computeDashboardStats } from "@/lib/steam/dashboardStats";
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
      <ProfileHeader
        player={summaryQuery.data}
        isLoading={summaryQuery.isPending}
        totalGames={stats?.totalGames ?? 0}
        totalHours={stats?.totalHours ?? 0}
        statsLoading={gamesQuery.isPending}
      />

      <BacklogProgress
        playedCount={stats?.playedCount ?? 0}
        unplayedCount={stats?.unplayedCount ?? 0}
        backlogPercent={stats?.backlogPercent ?? 0}
        isLoading={gamesQuery.isPending}
      />

      <PlaytimeHistogram
        data={
          gamesQuery.data ? computePlaytimeHistogram(gamesQuery.data.games) : []
        }
        isLoading={gamesQuery.isPending}
      />
    </main>
  );
}
