"use client";

import { useState } from "react";
import Image from "next/image";
import { SkeletonBlock } from "../shared/SkeletonBlock";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  player: { personaName: string; avatarUrl: string } | undefined;
  isLoading: boolean;
  totalGames: number;
  totalHours: number;
  statsLoading: boolean;
}

export function ProfileHeader({
  player,
  isLoading,
  totalGames,
  totalHours,
  statsLoading,
}: ProfileHeaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const showAvatarSkeleton = isLoading || !player || !imageLoaded;

  return (
    <div className={styles.header}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.content}>
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
            <SkeletonBlock width="220px" height="1.7rem" radius="xs" />
          ) : (
            <p className={styles.summary}>
              {totalGames} games · {totalHours} hours logged
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
