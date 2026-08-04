import { GameIcon } from '@/components/shared/GameIcon'
import { SkeletonBlock } from '@/components/shared/SkeletonBlock'
import type { Game } from '@/lib/steam/types'
import styles from './MostPlayedCard.module.css'

interface MostPlayedCardProps {
  game: Game | null
  isLoading: boolean
}

export function MostPlayedCard({ game, isLoading }: MostPlayedCardProps) {
  if (isLoading) {
    return (
      <div className={styles.card}>
        <span className={styles.eyebrow}>Most played</span>
        <div className={styles.row}>
          <SkeletonBlock width="48px" height="48px" radius="sm" />
          <div className={styles.textCol}>
            <SkeletonBlock width="140px" height="1.125rem" radius="xs" />
            <SkeletonBlock width="80px" height="0.875rem" radius="xs" />
          </div>
        </div>
      </div>
    )
  }

  if (!game) return null

  return (
    <div className={styles.card}>
      <h2 className={styles.eyebrow}>Most played</h2>
      <div className={styles.row}>
        <GameIcon src={game.iconUrl} alt={game.name} size={48} />
        <div className={styles.textCol}>
          <span className={styles.name}>{game.name}</span>
          <span className={styles.hours}>{Math.round(game.playtimeMinutes / 60)}h logged</span>
        </div>
      </div>
    </div>
  )
}