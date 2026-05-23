import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const [brandPrimary, brandSecondary = "Barber"] = BRAND.name.split(" ");

export function BrandLogo({
  href = "#inicio",
  size = "md",
  showText = true,
  className,
}: BrandLogoProps) {
  const content = (
    <span className={`${styles.wrap} ${styles[size]} ${className ?? ""}`}>
      <Image
        src="/logo.svg"
        alt={BRAND.name}
        width={size === "lg" ? 72 : size === "sm" ? 36 : 48}
        height={size === "lg" ? 72 : size === "sm" ? 36 : 48}
        className={styles.mark}
        priority
      />
      {showText ? (
        <span className={styles.text}>
          <span className={styles.name}>{brandPrimary}</span>
          <span className={styles.tag}>{brandSecondary}</span>
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {content}
      </Link>
    );
  }

  return content;
}
