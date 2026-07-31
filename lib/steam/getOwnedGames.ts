import { SteamOwnedGamesResponseSchema, type Game } from "./types";

export class PrivateProfileError extends Error {
  constructor() {
    super("Steam profile is private or has no public game data");
    this.name = "PrivateProfileError";
  }
}

export async function getOwnedGames(steamid: string): Promise<Game[]> {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true&format=json`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Steam API returned ${res.status}`);
  }

  const raw = await res.json();
  const parsed = SteamOwnedGamesResponseSchema.parse(raw);

  if (!parsed.response.games) {
    throw new PrivateProfileError();
  }

  return parsed.response.games.map(
    (game): Game => ({
      appId: game.appid,
      name: game.name,
      playtimeMinutes: game.playtime_forever,
      iconUrl: game.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
        : null,
      lastPlayed:
        game.rtime_last_played > 0
          ? new Date(game.rtime_last_played * 1000)
          : null,
      genres: null, // enriched later by the genres route
    }),
  );
}
