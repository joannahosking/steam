import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import {formatNumber} from "@/lib/formatNumber";
import styles from "./BacklogProgress.module.css";

interface BacklogProgressProps {
  playedCount: number;
  unplayedCount: number;
  backlogPercent: number;
  isLoading: boolean;
}

export function BacklogProgress({
  playedCount,
  unplayedCount,
  backlogPercent,
  isLoading,
}: BacklogProgressProps) {
  const playedPercent = 100 - backlogPercent;

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        {isLoading ? (
          <>
            <SkeletonBlock width="70px" height="1.45rem" radius="xs" />
            <SkeletonBlock width="90px" height="1.4rem" radius="xs" />
          </>
        ) : (
          <>
            <h2 className={styles.eyebrow}>Backlog</h2>
            <span className={styles.percent}>{backlogPercent}% unplayed</span>
          </>
        )}
      </div>

      {isLoading ? (
        <SkeletonBlock width="100%" height="10px" radius="xs" />
      ) : (
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={playedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Percent of library played"
        >
          <div className={styles.fill} style={{ width: `${playedPercent}%` }} />
        </div>
      )}

      <div className={styles.legend}>
        {isLoading ? (
          <>
            <SkeletonBlock width="90px" height="1.45rem" radius="xs" />
            <SkeletonBlock width="100px" height="1.45rem" radius="xs" />
          </>
        ) : (
          <>
            <span className={styles.legendItem}>
              <span className={styles.dotPlayed} /> {formatNumber(playedCount)} played
            </span>
            <span className={styles.legendItem}>
              <span className={styles.dotUnplayed} /> {formatNumber(unplayedCount)} untouched
            </span>
          </>
        )}
      </div>
    </div>
  );
}
