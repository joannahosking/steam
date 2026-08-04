"use client";

import { useState } from "react";
import Image from "next/image";
import { SkeletonBlock } from "../shared/SkeletonBlock";
import { formatNumber } from "@/lib/formatNumber";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  player: { personaName: string; avatarUrl: string } | undefined;
  isLoading: boolean;
  totalGames: number;
  totalHours: number;
  backlogPercent: number;
  statsLoading: boolean;
}

export function ProfileHeader({
  player,
  isLoading,
  totalGames,
  totalHours,
  backlogPercent,
  statsLoading,
}: ProfileHeaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const showAvatarSkeleton = isLoading || !player || !imageLoaded;

  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <div className={styles.identity}>
          <div className={styles.avatarWrapper}>
            {showAvatarSkeleton && (
              <SkeletonBlock width="72px" height="72px" radius="md" />
            )}
            {player && (
              <Image
                src={player.avatarUrl}
                alt=""
                width={72}
                height={72}
                className={styles.avatar}
                loading="eager"
                style={{ opacity: imageLoaded ? 1 : 0 }}
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>

          <div className={styles.textBlock}>
            {isLoading || !player ? (
              <SkeletonBlock width="180px" height="2rem" radius="xs" />
            ) : (
              <h1 className={styles.name}>{player.personaName}</h1>
            )}
            {statsLoading ? (
              <SkeletonBlock width="120px" height="1.7rem" radius="xs" />
            ) : (
              <p className={styles.summary}>
                {formatNumber(totalHours)} hours logged
              </p>
            )}
          </div>
        </div>

        <div className={styles.highlights}>
          {statsLoading ? (
            <>
              <SkeletonBlock width="70px" height="2.5rem" radius="sm" />
              <SkeletonBlock width="70px" height="2.5rem" radius="sm" />
            </>
          ) : (
            <>
              <div className={styles.highlight}>
                <span className={styles.highlightValue}>
                  {formatNumber(totalGames)}
                </span>
                <span className={styles.highlightLabel}>games</span>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightValue}>{backlogPercent}%</span>
                <span className={styles.highlightLabel}>backlog</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
