import { describe, it, expect } from "vitest";
import { computeGenreDistribution } from "./genreDistribution";
import type { Game } from "./types";

function makeGame(overrides: Partial<Game>): Game {
  return {
    appId: 1,
    name: "Test Game",
    playtimeMinutes: 0,
    iconUrl: null,
    lastPlayed: null,
    genres: null,
    ...overrides,
  };
}

describe("computeGenreDistribution", () => {
  it("assigns all playtime to a single genre when only one genre exists", () => {
    const games = [makeGame({ playtimeMinutes: 100, genres: ["RPG"] })];

    const result = computeGenreDistribution(games);

    expect(result).toEqual([{ genre: "RPG", minutes: 100 }]);
  });

  it("splits playtime evenly across multiple genres for one game", () => {
    const games = [
      makeGame({ playtimeMinutes: 100, genres: ["RPG", "Simulation"] }),
    ];

    const result = computeGenreDistribution(games);

    expect(result).toContainEqual({ genre: "RPG", minutes: 50 });
    expect(result).toContainEqual({ genre: "Simulation", minutes: 50 });
  });

  it("sums shared genres across multiple games", () => {
    const games = [
      makeGame({ playtimeMinutes: 100, genres: ["RPG"] }),
      makeGame({ playtimeMinutes: 200, genres: ["RPG", "Strategy"] }),
    ];

    const result = computeGenreDistribution(games);

    // 100 (all RPG) + 100 (half of 200) = 200
    expect(result).toContainEqual({ genre: "RPG", minutes: 200 });
    expect(result).toContainEqual({ genre: "Strategy", minutes: 100 });
  });

  it("excludes games with no genre data", () => {
    const games = [
      makeGame({ playtimeMinutes: 100, genres: ["RPG"] }),
      makeGame({ playtimeMinutes: 500, genres: null }),
    ];

    const result = computeGenreDistribution(games);

    expect(result).toEqual([{ genre: "RPG", minutes: 100 }]);
  });

  it("excludes games with an empty genre array", () => {
    const games = [makeGame({ playtimeMinutes: 500, genres: [] })];

    const result = computeGenreDistribution(games);

    expect(result).toEqual([]);
  });

  it("returns results sorted by minutes descending", () => {
    const games = [
      makeGame({ playtimeMinutes: 50, genres: ["Strategy"] }),
      makeGame({ playtimeMinutes: 500, genres: ["RPG"] }),
    ];

    const result = computeGenreDistribution(games);

    expect(result[0].genre).toBe("RPG");
    expect(result[1].genre).toBe("Strategy");
  });

  it("returns an empty array for an empty games list", () => {
    expect(computeGenreDistribution([])).toEqual([]);
  });
});
