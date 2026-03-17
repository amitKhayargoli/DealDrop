import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarqueeBanner from "@/components/landing/MarqueeBanner";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeBanner />
        <HowItWorksSection />
        <FeaturesSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
