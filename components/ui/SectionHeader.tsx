"use client";

import { motion } from "framer-motion";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  highlight,
}: SectionHeaderProps) {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <h2 className={styles.title}>
        {title}
        {highlight ? (
          <>
            {" "}
            <span className={styles.gold}>{highlight}</span>
          </>
        ) : null}
      </h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </motion.header>
  );
}
