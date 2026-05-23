"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  index?: number;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={styles.icon}>
          <Icon size={22} />
        </span>
      </div>
      <p className={styles.value}>{value}</p>
      {trend ? <p className={styles.trend}>{trend}</p> : null}
    </motion.div>
  );
}
