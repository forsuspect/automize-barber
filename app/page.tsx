import { About } from "@/components/website/About";
import { Barbers } from "@/components/website/Barbers";
import { CTA } from "@/components/website/CTA";
import { Gallery } from "@/components/website/Gallery";
import { Hero } from "@/components/website/Hero";
import { Services } from "@/components/website/Services";
import { Testimonials } from "@/components/website/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Barbers />
        <Gallery />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
