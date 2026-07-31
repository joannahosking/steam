"use client";

import { use } from "react";
import { useOwnedGames } from "@/hooks/useOwnedGames";
import { useGameGenres } from "@/hooks/useGameGenres";
import { ApiError } from "@/lib/steam/fetchJson";

interface PageProps {
  params: Promise<{ steamid: string }>;
}

export default function DashboardPage({ params }: PageProps) {
  const { steamid } = use(params);

  const gamesQuery = useOwnedGames(steamid);
  const genresQuery = useGameGenres(steamid);

  if (gamesQuery.isPending) {
    return <div>Loading games…</div>;
  }

  if (gamesQuery.isError) {
    if (
      gamesQuery.error instanceof ApiError &&
      gamesQuery.error.code === "private_profile"
    ) {
      return (
        <div>
          This Steam profile is private. Ask the owner to set "Game details" to
          Public.
        </div>
      );
    }
    return <div>Something went wrong loading this library.</div>;
  }

  const { games } = gamesQuery.data;

  return (
    <main>
      <h1>{games.length} games</h1>

      <section>
        <h2>Stats</h2>
        <p>
          Total playtime: {games.reduce((sum, g) => sum + g.playtimeMinutes, 0)}{" "}
          minutes
        </p>
      </section>

      <section>
        <h2>Genres</h2>
        {genresQuery.isPending && <p>Loading genre breakdown…</p>}
        {genresQuery.isError && <p>Couldn't load genre data.</p>}
        {genresQuery.data && (
          <pre>{JSON.stringify(genresQuery.data.genres, null, 2)}</pre>
        )}
      </section>
    </main>
  );
}
