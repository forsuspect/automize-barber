"use client";

import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Scissors,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/constants";
import styles from "./AdminSidebar.module.css";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/dashboard/agendamentos",
    label: "Agendamentos",
    icon: Calendar,
  },
  { href: "/admin/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/admin/dashboard/barbeiros", label: "Barbeiros", icon: Scissors },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <>
      {open ? (
        <div className={styles.overlay} onClick={onClose} aria-hidden />
      ) : null}
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logo}>
          {BRAND.name}
          <span>Painel Admin</span>
        </div>
        <nav className={styles.nav}>
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" &&
                pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                onClick={onClose}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.footer}>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
