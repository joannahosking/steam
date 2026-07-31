const cache = new Map<string, string[] | null>();

export function getCachedGenres(name: string) {
  return cache.get(name.toLowerCase());
}

export function setCachedGenres(name: string, genres: string[] | null) {
  cache.set(name.toLowerCase(), genres);
}
