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
];

export function GenreChart({ data, isLoading }: GenreChartProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.eyebrow}>Genres played</h2>

      {isLoading ? (
        <SkeletonBlock width="180px" height="180px" radius="md" />
      ) : data.length === 0 ? (
        <p className={styles.empty}>
          Not enough data to show a genre breakdown.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="genre"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                if (typeof value !== "number") return String(value);
                return `${Math.round(value / 60)}h`;
              }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
