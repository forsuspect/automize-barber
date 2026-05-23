"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/context/AppContext";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { testimonials } = useApp();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <section id="depoimentos" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Depoimentos"
          title="O que dizem"
          highlight="nossos clientes"
        />

        <div className={styles.carousel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className={styles.slide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={current.photo}
                alt={current.name}
                width={80}
                height={80}
                className={styles.avatar}
              />
              <div className={styles.stars}>
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <blockquote className={styles.comment}>
                &ldquo;{current.comment}&rdquo;
              </blockquote>
              <cite className={styles.name}>— {current.name}</cite>
            </motion.div>
          </AnimatePresence>

          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
