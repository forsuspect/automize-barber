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
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, mounted]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      suppressHydrationWarning
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
                className={`${styles.link} ${mounted && activeId === id ? styles.active : ""}`}
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
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${mounted && activeId === id ? styles.active : ""}`}
                  onClick={closeMobile}
                >
                  {link.label}
                </a>
              );
            })}
            <div className={styles.mobileCta}>
              <Link href="/agendar" onClick={closeMobile}>
                <Button fullWidth>Agendar horário</Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
