import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Barbearia Premium`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Barbearia premium em São Paulo. Cortes exclusivos, barba, grooming e experiência VIP. Agende seu horário online.",
  keywords: [
    "barbearia premium",
    "barbearia são paulo",
    "corte masculino",
    "barba",
    "agendamento barbearia",
  ],
  openGraph: {
    title: BRAND.name,
    description: BRAND.subtitle,
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${cormorant.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
