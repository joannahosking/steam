import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getOwnedGames, PrivateProfileError } from "./getOwnedGames";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

describe("getOwnedGames", () => {
  beforeEach(() => {
    process.env.STEAM_API_KEY = "test-key";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("transforms a valid Steam response into clean Game objects", async () => {
    mockFetchOnce({
      response: {
        game_count: 1,
        games: [
          {
            appid: 413150,
            name: "Stardew Valley",
            playtime_forever: 7593,
            img_icon_url: "abc123",
            rtime_last_played: 1684096509,
          },
        ],
      },
    });

    const games = await getOwnedGames("76561197960287930");

    expect(games).toEqual([
      {
        appId: 413150,
        name: "Stardew Valley",
        playtimeMinutes: 7593,
        iconUrl:
          "https://media.steampowered.com/steamcommunity/public/images/apps/413150/abc123.jpg",
        lastPlayed: new Date(1684096509 * 1000),
        genres: null,
      },
    ]);
  });

  it("sets lastPlayed to null when rtime_last_played is 0", async () => {
    mockFetchOnce({
      response: {
        game_count: 1,
        games: [
          {
            appid: 13600,
            name: "Prince of Persia: The Sands of Time",
            playtime_forever: 0,
            rtime_last_played: 0,
          },
        ],
      },
    });

    const games = await getOwnedGames("76561197960287930");

    expect(games[0].lastPlayed).toBeNull();
  });

  it("sets iconUrl to null when img_icon_url is missing", async () => {
    mockFetchOnce({
      response: {
        game_count: 1,
        games: [
          {
            appid: 13600,
            name: "Some Game",
            playtime_forever: 0,
            rtime_last_played: 0,
          },
        ],
      },
    });

    const games = await getOwnedGames("76561197960287930");

    expect(games[0].iconUrl).toBeNull();
  });

  it("throws PrivateProfileError when games is absent (private profile)", async () => {
    mockFetchOnce({ response: {} });

    await expect(getOwnedGames("76561197960287930")).rejects.toThrow(
      PrivateProfileError,
    );
  });

  it("throws when Steam responds with a non-ok status", async () => {
    mockFetchOnce({}, false, 500);

    await expect(getOwnedGames("76561197960287930")).rejects.toThrow(
      "Steam API returned 500",
    );
  });

  it("throws when the response shape does not match the expected schema", async () => {
    mockFetchOnce({ response: { games: [{ totally: "wrong shape" }] } });

    await expect(getOwnedGames("76561197960287930")).rejects.toThrow();
  });

  it("defaults rtime_last_played to 0 when the field is missing entirely", async () => {
    mockFetchOnce({
      response: {
        game_count: 1,
        games: [
          { appid: 999, name: "Old Game", playtime_forever: 5 }, // no rtime_last_played at all
        ],
      },
    });

    const games = await getOwnedGames("76561197960287930");

    expect(games[0].lastPlayed).toBeNull();
  });
});
