"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Star, Users } from "lucide-react";
import Image from "next/image";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import { BRAND } from "@/lib/constants";
import styles from "./About.module.css";

const FEATURES = [
  {
    icon: Crown,
    title: "Atendimento VIP",
    desc: "Experiência exclusiva com bebidas premium e ambiente reservado.",
  },
  {
    icon: Sparkles,
    title: "Ambiente Moderno",
    desc: "Design sofisticado com tecnologia e conforto de alto padrão.",
  },
  {
    icon: Star,
    title: "Diferenciais",
    desc: "Produtos importados e técnicas internacionais de grooming.",
  },
  {
    icon: Users,
    title: "Equipe Elite",
    desc: "Barbeiros certificados com anos de experiência premium.",
  },
];

const ABOUT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=1000&fit=crop",
    alt: `Interior premium ${BRAND.name}`,
  },
  {
    src: "https://images.unsplash.com/photo-1593702275687-f2b0389453fb?w=800&h=1000&fit=crop",
    alt: "Ambiente sofisticado",
  },
  {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=1000&fit=crop",
    alt: "Experiência de corte premium",
  },
];

export function About() {
  const { ref, visible } = useReveal();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const imageSlides = ABOUT_IMAGES.map((img) => (
    <div key={img.src} className={styles.carouselImage}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className={styles.image}
        sizes="90vw"
      />
    </div>
  ));

  return (
    <section id="sobre" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Nossa História"
          title="Tradição e"
          highlight="excelência"
          subtitle={`Desde 2018, a ${BRAND.name} redefine o conceito de barbearia premium em São Paulo.`}
        />

        {isMobile ? (
          <div className={styles.mobileCarouselWrap}>
            <MobileCarousel ariaLabel="Fotos da barbearia" autoPlayMs={4500}>
              {imageSlides}
            </MobileCarousel>
          </div>
        ) : null}

        <div
          ref={ref}
          className={styles.grid}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(40px)",
            transition: "all 0.7s ease",
          }}
        >
          {!isMobile ? (
            <motion.div
              className={styles.imageWrap}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src={ABOUT_IMAGES[0].src}
                alt={ABOUT_IMAGES[0].alt}
                fill
                className={styles.image}
                sizes="50vw"
              />
            </motion.div>
          ) : null}

          <div className={styles.content}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3>Nossa Missão</h3>
              <p>
                Elevar a autoestima de cada cliente através de um serviço
                impecável, ambiente luxuoso e atenção aos mínimos detalhes.
                Acreditamos que cuidar da aparência é um ritual de
                autoconfiança.
              </p>
              <p>
                Combinamos a tradição da barbearia clássica com inovação,
                tecnologia e o mais alto padrão de atendimento do mercado.
              </p>

              <div className={styles.features}>
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className={styles.feature}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <f.icon className={styles.featureIcon} size={24} />
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
