"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "@/utils/whatsapp";
import styles from "./CTA.module.css";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ color: "#25D366" }}
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.975L2 22l5.164-1.354a9.937 9.937 0 0 0 4.847 1.251h.004c5.505 0 9.988-4.478 9.99-9.984 0-2.668-1.037-5.176-2.922-7.062A9.92 9.92 0 0 0 12.012 2zm0 1.662c2.222 0 4.31.865 5.88 2.437a8.27 8.27 0 0 1 2.446 5.885c-.002 4.568-3.717 8.28-8.285 8.28a8.253 8.253 0 0 1-4.218-1.155l-.302-.18-3.136.822.835-3.057-.197-.314a8.243 8.243 0 0 1-1.263-4.38c.002-4.569 3.719-8.28 8.285-8.28zm-.008 2.482a.834.834 0 0 0-.598.248c-.287.29-.684.72-.684 1.545 0 .825.602 1.62.686 1.733.084.113 1.164 1.777 2.82 2.493.393.17.7.272.939.349.395.126.755.108 1.039.066.317-.047.975-.399 1.11-.784.137-.385.137-.715.096-.784-.041-.069-.15-.109-.315-.192-.165-.083-.975-.481-1.126-.536-.151-.055-.261-.083-.371.083-.11.165-.426.536-.522.646-.096.11-.192.124-.357.041a4.5 4.5 0 0 1-1.32-.814 4.966 4.966 0 0 1-.914-1.139c-.096-.165-.01-.254.072-.336.074-.074.165-.193.248-.29a1.11 1.11 0 0 0 .165-.275.303.303 0 0 0-.014-.29c-.041-.082-.371-.894-.509-1.224-.134-.324-.27-.28-.371-.285a3.486 3.486 0 0 0-.29-.005z" />
  </svg>
);

export function CTA() {
  const whatsappUrl = buildWhatsAppUrl(
    `Olá! Gostaria de agendar um horário na ${BRAND.name}.`
  );

  return (
    <section className={styles.section}>
      <div className={styles.bg} />
      <div className={styles.wrapper}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Transforme seu visual hoje mesmo.</h2>
          <p className={styles.subtitle}>
            Agende agora e viva a experiência premium que você merece.
          </p>
          <div className={styles.actions}>
            <Link href="/agendar">
              <Button size="lg">Agendar agora</Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">
                <WhatsAppIcon size={20} />
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
