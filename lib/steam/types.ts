import { z } from "zod";

const RawSteamGameSchema = z.object({
  appid: z.number(),
  name: z.string(),
  playtime_forever: z.number(),
  img_icon_url: z.string().optional(),
  rtime_last_played: z.number(),
  playtime_2weeks: z.number().optional(),
  has_community_visible_stats: z.boolean().optional(),
});

export const SteamOwnedGamesResponseSchema = z.object({
  response: z.object({
    game_count: z.number().optional(),
    games: z.array(RawSteamGameSchema).optional(), // optional for private profiles
  }),
});

export type RawSteamGame = z.infer<typeof RawSteamGameSchema>;
export type SteamOwnedGamesResponse = z.infer<
  typeof SteamOwnedGamesResponseSchema
>;

export interface Game {
  appId: number;
  name: string;
  playtimeMinutes: number;
  iconUrl: string | null;
  lastPlayed: Date | null;
  genres: string[] | null;
}
