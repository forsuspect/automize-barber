"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import styles from "./Hero.module.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.25]);

  const titleParts = BRAND.tagline.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const titleStart = titleParts.join(" ");

  return (
    <section id="inicio" className={styles.hero} ref={ref}>
      <div className={styles.bg}>
        <motion.div className={styles.bgParallax} style={{ y }}>
          <Image
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80"
            alt={`Barbearia premium ${BRAND.name}`}
            fill
            priority
            className={styles.bgImage}
            sizes="100vw"
          />
        </motion.div>
        <div className={styles.overlay} />
        <div className={styles.grain} aria-hidden />
      </div>

      <div className={styles.frame} aria-hidden />

      <motion.div className={styles.content} style={{ opacity }}>
        <motion.div
          className={styles.logoWrap}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <BrandLogo href="#inicio" size="lg" />
        </motion.div>

        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Premium Experience
        </motion.span>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {titleStart}{" "}
          <span className={styles.titleAccent}>{lastWord}</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {BRAND.subtitle}
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Link href="/agendar" className={styles.ctaLink}>
            <Button size="lg" fullWidth>
              Agendar horário
            </Button>
          </Link>
          <a href="#servicos" className={styles.ctaLink}>
            <Button variant="secondary" size="lg" fullWidth>
              Conhecer serviços
            </Button>
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-label="Rolar para baixo"
      >
        <span>Scroll</span>
        <span className={styles.scrollLine} />
      </motion.a>
    </section>
  );
}
