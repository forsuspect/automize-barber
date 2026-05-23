"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./Navbar.module.css";

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <BrandLogo href="#inicio" size="sm" />

        <nav className={styles.nav} aria-label="Principal">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`${styles.link} ${activeId === id ? styles.active : ""}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/agendar" className={styles.desktopOnly}>
            <Button size="sm">Agendar horário</Button>
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            className={styles.mobileMenu}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${activeId === id ? styles.active : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className={styles.mobileCta}>
              <Link href="/agendar" onClick={() => setMobileOpen(false)}>
                <Button fullWidth>Agendar horário</Button>
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
