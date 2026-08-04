"use client";

import { useState, useMemo, useEffect } from "react";
import { GameIcon } from "@/components/shared/GameIcon";
import { formatNumber } from "@/lib/formatNumber";
import type { Game } from "@/lib/steam/types";
import styles from "./GamesTable.module.css";

const PAGE_SIZE = 15;

type SortKey = "name" | "playtimeMinutes" | "lastPlayed";
type SortDirection = "asc" | "desc";

interface GamesTableProps {
  games: Game[];
  genresLoading: boolean;
}

export function GamesTable({ games, genresLoading }: GamesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("playtimeMinutes");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const sortedGames = useMemo(() => {
    const sorted = [...games].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "lastPlayed") {
        const aTime = a.lastPlayed?.getTime() ?? 0;
        const bTime = b.lastPlayed?.getTime() ?? 0;
        return aTime - bTime;
      }
      return a.playtimeMinutes - b.playtimeMinutes;
    });
    return sortDirection === "desc" ? sorted.reverse() : sorted;
  }, [games, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedGames.length / PAGE_SIZE));

  // reset to page 1 on new sort
  useEffect(() => {
    setPage(1);
  }, [sortKey, sortDirection]);

  const pageGames = sortedGames.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  function formatLastPlayed(game: Game): string {
    if (game.lastPlayed) return game.lastPlayed.toLocaleDateString("en-GB");
    if (game.playtimeMinutes > 0) return "Unknown";
    return "Never";
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Full library</h2>
        <span className={styles.count}>{games.length} games</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>
              <button
                className={styles.sortButton}
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortKey === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th>
              <button
                className={styles.sortButton}
                onClick={() => handleSort("playtimeMinutes")}
              >
                Playtime{" "}
                {sortKey === "playtimeMinutes" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th>Genre</th>
            <th>
              <button
                className={styles.sortButton}
                onClick={() => handleSort("lastPlayed")}
              >
                Last played{" "}
                {sortKey === "lastPlayed" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageGames.map((game) => (
            <tr key={game.appId}>
              <td>
                <GameIcon src={game.iconUrl} alt={game.name} size={32} />
              </td>
              <td>{game.name}</td>
              <td>{formatNumber(Math.round(game.playtimeMinutes / 60))}h</td>
              <td className={styles.genreCell}>
                {genresLoading ? (
                  <span className={styles.genreSkeleton} />
                ) : (
                  (game.genres?.[0] ?? "—")
                )}
              </td>
              <td>{formatLastPlayed(game)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pager}>
          <button
            className={styles.pagerButton}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className={styles.pagerLabel}>
            Page {page} of {totalPages}
          </span>
          <button
            className={styles.pagerButton}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
