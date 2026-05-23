import { BRAND } from "@/lib/constants";

/** Mensagem genérica para contato com a barbearia (footer, CTA) */
export function buildContactWhatsAppMessage(): string {
  return `Olá! Gostaria de mais informações sobre a ${BRAND.name}.`;
}

export function buildWhatsAppUrl(message: string, phone = BRAND.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
