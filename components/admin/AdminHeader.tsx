"use client";

import { Menu } from "lucide-react";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.user}>
        <span>Administrador</span>
        <span className={styles.avatar}>A</span>
      </div>
    </header>
  );
}
