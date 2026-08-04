import { GameIcon } from "@/components/shared/GameIcon";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import type { PlayNextSuggestion } from "@/lib/steam/playNext";
import styles from "./PlayNextList.module.css";

interface PlayNextListProps {
  suggestions: PlayNextSuggestion[];
  isLoading: boolean;
}

export function PlayNextList({ suggestions, isLoading }: PlayNextListProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.eyebrow}>Backlog Recommendations</h2>

      {isLoading ? (
        <div className={styles.list}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonRow}>
              <SkeletonBlock width="40px" height="40px" radius="sm" />
              <SkeletonBlock width="140px" height="0.875rem" radius="xs" />
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p>
          No strong backlog matches yet. Either your backlog is very small or
          genre data is still catching up.
        </p>
      ) : (
        <ul className={styles.list}>
          {suggestions.map(({ game, matchedGenres }) => (
            <li key={game.appId} className={styles.row}>
              <GameIcon src={game.iconUrl} alt={game.name} size={40} />
              <div className={styles.info}>
                <span className={styles.name}>{game.name}</span>
                <span className={styles.reason}>
                  {matchedGenres.join(" · ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
