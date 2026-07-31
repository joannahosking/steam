const STEAMID64_REGEX = /^\d{17}$/;

function extractIdentifier(input: string): string {
  const trimmed = input.trim();

  // Full profile URL with numeric ID
  const profileMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profileMatch) return profileMatch[1];

  // Full vanity URL
  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/);
  if (vanityMatch) return vanityMatch[1];

  // Otherwise assume it's already a bare steamid64 or bare vanity name
  return trimmed.replace(/\/$/, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("q");

  if (!input) {
    return Response.json({ error: "missing_query" }, { status: 400 });
  }

  const identifier = extractIdentifier(input);

  // Already a steamid64, hand it straight back
  if (STEAMID64_REGEX.test(identifier)) {
    return Response.json({ steamid: identifier });
  }

  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_API_KEY}&vanityurl=${encodeURIComponent(identifier)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.response.success !== 1) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ steamid: data.response.steamid });
}
