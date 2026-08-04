const LOW_SIGNAL_GENRES = new Set(["Indie", "Casual", "Family", "Educational"]);

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[™®©]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Deprioritise low signal genres
function rankGenres(genres: string[]): string[] {
  return [...genres].sort((a, b) => {
    const aLow = LOW_SIGNAL_GENRES.has(a) ? 1 : 0;
    const bLow = LOW_SIGNAL_GENRES.has(b) ? 1 : 0;
    return aLow - bLow;
  });
}

async function fetchWithRetry(
  url: string,
  retries = 2,
): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;

    // Only retry server-side/transient errors, not permanent client errors (401, 404)
    if (res.status < 500 && res.status !== 522) return res;

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1))); // 500ms, then 1000ms
    }
  }
  return null;
}

export async function fetchGenresFromRawg(
  gameName: string,
): Promise<string[] | null> {
  const url = `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=1`;

  const res = await fetchWithRetry(url);
  if (!res || !res.ok) {
    console.error(`RAWG lookup failed for "${gameName}": ${res?.status}`);
    return null;
  }

  const data = await res.json();
  const match = data.results?.[0];
  if (!match) return null;

  const searched = normalize(gameName);
  const found = normalize(match.name);
  if (
    !found.includes(searched.split(" ")[0]) &&
    !searched.includes(found.split(" ")[0])
  ) {
    return null;
  }

  const allGenres: string[] = match.genres.map((g: { name: string }) => g.name);
  if (allGenres.length === 0) return null;

  return rankGenres(allGenres).slice(0, 2);
}
