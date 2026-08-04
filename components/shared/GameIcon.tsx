"use client";

import { useState } from "react";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import styles from "./GameIcon.module.css";

interface GameIconProps {
  src: string | null;
  alt: string;
  size?: number;
}

export function GameIcon({ src, alt, size = 32 }: GameIconProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={styles.fallback}
        style={{ width: size, height: size }}
        role="img"
        aria-label={alt}
      >
        <Gamepad2 size={size * 0.75} color="var(--text-subtle)" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={styles.icon}
      onError={() => setFailed(true)}
    />
  );
}
