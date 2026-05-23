import styles from "./Skeleton.module.css";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "textShort" | "avatar";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className ?? ""}`}
      aria-hidden
    />
  );
}
