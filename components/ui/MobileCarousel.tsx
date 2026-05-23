"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./MobileCarousel.module.css";

interface MobileCarouselProps {
  children: ReactNode[];
  desktopClassName?: string;
  autoPlayMs?: number;
  ariaLabel?: string;
}

export function MobileCarousel({
  children,
  desktopClassName,
  autoPlayMs = 4500,
  ariaLabel = "Carrossel",
}: MobileCarouselProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [index, setIndex] = useState(0);
  const count = children.length;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (!isMobile || count <= 1 || !autoPlayMs) return;
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [isMobile, count, autoPlayMs, next]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  if (!isMobile) {
    return (
      <div className={desktopClassName}>{children}</div>
    );
  }

  if (count === 0) return null;

  return (
    <div className={styles.carousel} aria-label={ariaLabel}>
      <div className={styles.viewport}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className={styles.slide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
          >
            {children[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={next}
            aria-label="Próximo"
          >
            <ChevronRight size={22} />
          </button>
          <div className={styles.dots}>
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Item ${i + 1} de ${count}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
