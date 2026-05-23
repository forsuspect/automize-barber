import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Loader } from "@/components/ui/Loader";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Agendar horário",
  description: `Agende seu horário na ${BRAND.name} de forma rápida e premium.`,
};

export default function AgendarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader fullscreen />}>
        <BookingForm />
      </Suspense>
      <Footer />
    </>
  );
}
