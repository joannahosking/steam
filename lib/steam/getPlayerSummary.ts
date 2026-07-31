import { SteamPlayerSummaryResponseSchema, type Player } from "./types";

export class PrivateProfileError extends Error {
  constructor() {
    super("Steam profile is private or has no public player summary data");
    this.name = "PrivateProfileError";
  }
}

export async function getPlayerSummary(steamid: string): Promise<Player> {
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamid}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Steam API returned ${res.status}`);
  }

  const raw = await res.json();
  const parsed = SteamPlayerSummaryResponseSchema.parse(raw);

  const player = parsed.response.players
    ? parsed.response.players[0]
    : undefined;

  if (!player) {
    throw new PrivateProfileError();
  }

  return {
    steamId: player.steamid,
    personaName: player.personaname,
    avatarUrl: player.avatarfull,
  };
}
