"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Eye,
  Palette,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/utils/format";
import styles from "./Services.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  scissors: Scissors,
  sparkles: Sparkles,
  palette: Palette,
  eye: Eye,
  crown: Crown,
  star: Star,
};

export function Services() {
  const { services } = useApp();

  return (
    <section id="servicos" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Serviços"
          title="Experiências"
          highlight="exclusivas"
          subtitle="Cada serviço foi pensado para entregar o máximo em qualidade, conforto e resultado."
        />

        <div className={styles.grid}>
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Scissors;
            return (
              <motion.article
                key={service.id}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={styles.iconWrap}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.desc}>{service.description}</p>
                <div className={styles.meta}>
                  <span className={styles.price}>
                    {formatCurrency(service.price)}
                  </span>
                  <span className={styles.duration}>{service.duration} min</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
