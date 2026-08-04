const cache = new Map<number, string[] | null>();

export function getCachedGenres(appId: number) {
  return cache.get(appId);
}

export function setCachedGenres(appId: number, genres: string[] | null) {
  cache.set(appId, genres);
}
