import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "@/utils/whatsapp";
import styles from "./Footer.module.css";

const FOOTER_NAV = [
  ...NAV_LINKS,
  { href: "/agendar", label: "Agendar" },
];

const HOURS = [
  { days: "Seg – Sáb", time: "09h – 21h" },
  { days: "Domingo", time: "10h – 18h" },
];

const whatsappGeneral = buildWhatsAppUrl(buildContactWhatsAppMessage());

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <BrandLogo href="#inicio" size="sm" />
        </div>

        <div className={styles.grid}>
          <nav className={styles.block} aria-label="Navegação">
            <h4 className={styles.blockTitle}>Navegação</h4>
            <ul className={styles.linkList}>
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href}>{link.label}</Link>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>Contato</h4>
            <ul className={styles.contactList}>
              <li>
                <Phone size={15} aria-hidden />
                <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`}>
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <Mail size={15} aria-hidden />
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </li>
              <li>
                <MessageCircle size={15} aria-hidden />
                <a
                  href={whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>Local & horários</h4>
            <ul className={styles.contactList}>
              <li className={styles.addressItem}>
                <MapPin size={15} aria-hidden />
                <span>{BRAND.address}</span>
              </li>
              {HOURS.map((row) => (
                <li key={row.days} className={styles.hoursItem}>
                  <Clock size={15} aria-hidden />
                  <span>
                    {row.days}: <strong>{row.time}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {BRAND.name}
          </p>
          <p className={styles.credits}>
            Desenvolvido por{" "}
            <a
              href={BRAND.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.developer}
            >
              {BRAND.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
