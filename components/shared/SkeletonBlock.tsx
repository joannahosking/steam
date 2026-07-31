import styles from "./SkeletonBlock.module.css";

interface SkeletonBlockProps {
  width?: string;
  height?: string;
  radius?: "xs" | "sm" | "md";
}

export function SkeletonBlock({
  width = "100%",
  height = "1rem",
  radius = "sm",
}: SkeletonBlockProps) {
  return (
    <div
      className={styles.block}
      style={{ width, height, borderRadius: `var(--radius-${radius})` }}
    />
  );
}
