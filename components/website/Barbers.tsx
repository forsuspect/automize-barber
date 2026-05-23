"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/context/AppContext";
import type { Barber } from "@/types";
import styles from "./Barbers.module.css";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

function BarberCard({ barber }: { barber: Barber }) {
  return (
    <article className={styles.card}>
      <div className={styles.photoWrap}>
        <img
          src={barber.photo}
          alt={barber.name}
          className={styles.photo}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{barber.name}</h3>
        <p className={styles.specialty}>{barber.specialty}</p>
        <div className={styles.rating}>
          <span className={styles.stars}>
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={14}
                fill={j < Math.floor(barber.rating) ? "currentColor" : "none"}
              />
            ))}
          </span>
          <span>
            {barber.rating} ({barber.reviewCount} avaliações)
          </span>
        </div>
        <div className={styles.cardFooter}>
          {barber.instagram ? (
            <a
              href={`https://instagram.com/${barber.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={`Instagram de ${barber.name}`}
            >
              <InstagramIcon size={18} />
            </a>
          ) : (
            <span />
          )}
          <Link href={`/agendar?barbeiro=${barber.id}`}>
            <Button size="sm">Agendar</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Barbers() {
  const { barbers } = useApp();
  const activeBarbers = barbers.filter((b) => b.active);

  const cards = activeBarbers.map((barber) => (
    <BarberCard key={barber.id} barber={barber} />
  ));

  return (
    <section id="barbeiros" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Nossa Equipe"
          title="Mestres do"
          highlight="estilo"
          subtitle="Profissionais de elite, cada um com sua especialidade e paixão pelo detalhe."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <MobileCarousel
            desktopClassName={styles.grid}
            ariaLabel="Carrossel de barbeiros"
          >
            {cards}
          </MobileCarousel>
        </motion.div>
      </div>
    </section>
  );
}
