interface SteamAppDetailsResponse {
  [appid: string]: {
    success: boolean;
    data?: {
      genres?: Array<{ description: string }>;
    };
  };
}

async function fetchWithRetry(
  url: string,
  retries = 2,
): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;

    // retry transient/rate-limit responses, not permanent client errors
    if (res.status < 500 && res.status !== 429 && res.status !== 522)
      return res;

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  return null;
}

export async function fetchGenreFromSteamStore(
  appId: number,
): Promise<string[] | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

  const res = await fetchWithRetry(url);
  if (!res || !res.ok) {
    console.error(
      `Steam store lookup failed for appid ${appId}: ${res?.status}`,
    );
    return null;
  }

  const data: SteamAppDetailsResponse = await res.json();
  const entry = data[appId.toString()];

  if (
    !entry?.success ||
    !entry.data?.genres ||
    entry.data.genres.length === 0
  ) {
    return null;
  }

  return entry.data.genres.slice(0, 2).map((g) => g.description);
}
