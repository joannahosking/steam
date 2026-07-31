"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import type { HistogramBucket } from "@/lib/steam/playtimeHistogram";
import styles from "./PlaytimeHistogram.module.css";

interface PlaytimeHistogramProps {
  data: HistogramBucket[];
  isLoading: boolean;
}

export function PlaytimeHistogram({ data, isLoading }: PlaytimeHistogramProps) {
  const BUCKET_COLORS = [
    "var(--text-subtle)", // never played
    "var(--coral)",
    "var(--orange)",
    "var(--green)", // "success" color
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Playtime distribution</h2>

      {isLoading ? (
        <SkeletonBlock width="100%" height="220px" radius="sm" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-subtle)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--text-subtle)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={BUCKET_COLORS[index % BUCKET_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
