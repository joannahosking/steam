# Steam Dashboard

A dashboard that visualizes your Steam library: genre breakdown, backlog completion, playtime distribution, and personalized "play next" suggestions pulled from your own unplayed games.

**Live demo:** [add your Netlify URL here]

## Why this exists

Most Steam libraries are full of games bought on sale and never touched. This tool turns that backlog into something visual and actionable, showing what genres you actually play (not just own), how much of your library is untouched, and which unplayed games best match your actual taste.

## Features

- **Genre breakdown**: a proportional donut chart of playtime by genre, built from your most-played games
- **Backlog tracking**: played vs. untouched games, visualized as a progress bar
- **Playtime distribution**: a histogram bucketing your library by engagement level
- **Library recommendations**: unplayed games ranked by genre overlap with what you actually play most
- **Full sortable library table** with pagination
- Works with a Steam profile name, vanity URL, full profile URL, or raw SteamID64

## Tech stack

- **Next.js 15** (App Router), TypeScript
- **CSS Modules**, no utility framework, hand-rolled design tokens (colors, spacing, radius, type)
- **TanStack Query** for server state, caching, and independent loading states per data source
- **Zod** for runtime validation at every external API boundary
- **Recharts** for the genre donut chart and playtime histogram
- **Vitest + Testing Library** for unit tests covering data transforms and API logic

## Architecture notes

A few decisions worth calling out, since they're not obvious from the file structure alone.

### Independent, split loading, not one big spinner

The dashboard fires three parallel queries (owned games, genre enrichment, player summary) rather than gating the whole page behind a single loading state. Stats, the histogram, and the games table render the moment game data resolves. The genre chart and Play Next list load independently and show their own skeletons, since genre enrichment is the slowest and least reliable step. Nothing on the page waits on the slowest piece unless it actually depends on that data.

### Genre data: a two-provider fallback chain, not a single point of failure

Genre data isn't available from Steam's own `GetOwnedGames` endpoint, so it has to be sourced separately, per game.

**Why RAWG isn't the primary source.** RAWG was the original plan: a free API with a genres field and no key restrictions beyond a generous request quota. In practice, during development RAWG went down for an extended period (a full day, at one point) with no clear incident communication, and independent reports elsewhere describe the API as increasingly unreliable over time. A free third-party API with unclear uptime guarantees isn't something a "real" feature should depend on exclusively.

**Why Steam's own store endpoint became the primary source instead.** `store.steampowered.com/api/appdetails` is undocumented but stable, requires no API key, and returns genre data straight from Valve, keyed directly by appid rather than requiring fuzzy name matching (RAWG only supports search-by-name, which meant building a whole layer of name normalization to handle mismatches like "Dragon Age™" vs. "Dragon Age"). Genre lookups now hit this endpoint first, with RAWG kept as a secondary fallback for the cases Steam's endpoint can't answer, rather than relying on either provider alone.

**Why enrichment is capped by count, not run against the full library.** Steam's store endpoint is informally rate-limited (roughly 200 requests per 5-minute window per the community-documented behavior, since it's undocumented and unauthenticated). A library of even a few hundred games, enriched in full, would exceed that ceiling on a single dashboard load, before accounting for the fact that a deployed serverless function's outbound traffic is typically pooled across all visitors, not isolated per user. To stay well under that ceiling regardless of library size, enrichment is capped to a fixed number of the most-played games (for the genre chart) plus a fixed sample of unplayed games (so suggestions have something to match against), rather than growing unbounded with library size. Requests within that cap also run through a small concurrency limiter, and results are cached in memory by appid, so popular games are only ever looked up once regardless of how many different users' libraries include them.

Both providers fail independently and the app degrades gracefully either way. If a game's genre can't be resolved by Steam or RAWG, it's simply excluded from genre-weighted calculations rather than breaking the chart or crashing the page.

**Known limitation:** the in-memory genre cache resets on cold start in a serverless environment, since Netlify Functions don't share memory across instances. This is an acceptable tradeoff at this project's scale. A production version at higher traffic would move this to Redis (e.g. Upstash) or a small persistent table, so cache hits survive cold starts and are shared across concurrent function instances.

### Validation at every external boundary

Every response from Steam's API is validated with Zod before being trusted. Steam's own data isn't perfectly uniform across a large, varied library (some entries are missing fields the docs imply are always present), so the schema treats most fields as optional with sensible defaults rather than assuming a clean shape.

## Getting started

```bash
npm install
```

Create `.env.local` (see `.env.example` for the full list):

```
STEAM_API_KEY=
RAWG_API_KEY=
```

Get a Steam Web API key at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) and a RAWG key at [rawg.io/apidocs](https://rawg.io/apidocs).

```bash
npm run dev
```

## Testing

```bash
npm test
```

Unit tests cover the pure data-transform functions (genre distribution, playtime bucketing, dashboard stats) and the Steam API integration layer (schema validation, error handling, private-profile detection) with mocked network responses.

## Deployment

Deployed on Netlify via `@netlify/plugin-nextjs`. Requires `STEAM_API_KEY` and `RAWG_API_KEY` set as environment variables in the Netlify dashboard (site settings, then Environment variables). They're not committed and won't work via `.env.local` alone in production.

## Known limitations

- Genre enrichment depends on two third-party APIs, one of which (RAWG) has known reliability issues. The dashboard is built to degrade gracefully when either or both are unavailable, rather than assuming they're always up.
- The genre cache is in-memory and resets on cold start; see architecture notes above.
- Dashboard routes aren't explicitly deindexed from search engines, but aren't linked from anywhere crawlable either, so this was judged low-risk rather than worth the added complexity of route-level `noindex` metadata.