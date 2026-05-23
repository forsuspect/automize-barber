"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import styles from "./Loader.module.css";

interface LoaderProps {
  fullscreen?: boolean;
  text?: string;
}

export function Loader({ fullscreen, text = "Carregando..." }: LoaderProps) {
  return (
    <motion.div
      className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Image
        src="/logo.svg"
        alt={BRAND.name}
        width={64}
        height={64}
        className={styles.logoImg}
        priority
      />
      <span className={styles.ring} aria-hidden />
      <span className={styles.text}>{text}</span>
    </motion.div>
  );
}
