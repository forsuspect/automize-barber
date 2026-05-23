"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/context/AppContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { GalleryItem } from "@/types";
import styles from "./Gallery.module.css";

function GallerySlide({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (src: string) => void;
}) {
  return (
    <div
      className={styles.slideItem}
      onClick={() => onOpen(item.src)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(item.src)}
      aria-label={item.alt}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className={styles.slideImage}
        sizes="90vw"
      />
      <div className={styles.overlay}>
        <ZoomIn className={styles.zoomIcon} size={28} />
      </div>
    </div>
  );
}

export function Gallery() {
  const { gallery } = useApp();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const carouselSlides = gallery.map((item) => (
    <GallerySlide key={item.id} item={item} onOpen={setLightbox} />
  ));

  return (
    <section id="galeria" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Galeria"
          title="Nosso"
          highlight="universo"
          subtitle="Cada detalhe do nosso espaço foi pensado para proporcionar uma experiência única."
        />

        {isMobile ? (
          <MobileCarousel ariaLabel="Carrossel da galeria" autoPlayMs={4000}>
            {carouselSlides}
          </MobileCarousel>
        ) : (
          <div className={styles.masonry}>
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                className={styles.item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setLightbox(item.src)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightbox(item.src)}
                aria-label={item.alt}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={item.height}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className={styles.overlay}>
                  <ZoomIn className={styles.zoomIcon} size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="Galeria ampliada"
              className={styles.lightboxImg}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
