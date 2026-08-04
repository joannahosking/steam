"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import type { GenreSlice } from "@/lib/steam/genreDistribution";
import styles from "./GenreChart.module.css";

interface GenreChartProps {
  data: GenreSlice[];
  isLoading: boolean;
}

const SLICE_COLORS = [
  "var(--primary)",
  "var(--coral)",
  "var(--orange)",
  "var(--green)",
  "#5f4ef3",
  "#8fc453",
  "#864ecf",
];

export function GenreChart({ data, isLoading }: GenreChartProps) {
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <div className={styles.card}>
      <h2 className={styles.eyebrow}>Genres you actually play</h2>

      {isLoading ? (
        <div className={styles.chartLayout}>
          <SkeletonBlock width="180px" height="180px" radius="md" />
          <div className={styles.legend}>
            <SkeletonBlock width="120px" height="0.875rem" radius="xs" />
            <SkeletonBlock width="100px" height="0.875rem" radius="xs" />
            <SkeletonBlock width="110px" height="0.875rem" radius="xs" />
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Not enough playtime data to show a genre breakdown yet.</p>
        </div>
      ) : (
        <div className={styles.chartLayout}>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="minutes"
                  nameKey="genre"
                  innerRadius={10}
                  outerRadius={90}
                  strokeWidth={2}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `${Math.round(value / 60)}h`
                      : String(value)
                  }
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className={styles.legend}>
            {data.map((slice, index) => (
              <li key={slice.genre} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: SLICE_COLORS[index % SLICE_COLORS.length],
                  }}
                />
                <span className={styles.legendLabel}>{slice.genre}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
