import type { Game } from "./types";

export interface HistogramBucket {
  label: string;
  count: number;
}

const BUCKETS = [
  { label: "Never played", max: 0 },
  { label: "Under 5h", max: 300 }, // 5 hours in minutes
  { label: "5–20h", max: 1200 }, // 20 hours in minutes
  { label: "20h+", max: Infinity },
];

export function computePlaytimeHistogram(games: Game[]): HistogramBucket[] {
  const counts = BUCKETS.map((bucket) => ({ label: bucket.label, count: 0 }));

  for (const game of games) {
    const bucketIndex = BUCKETS.findIndex(
      (bucket) => game.playtimeMinutes <= bucket.max,
    );
    counts[bucketIndex === -1 ? BUCKETS.length - 1 : bucketIndex].count++;
  }

  return counts;
}
