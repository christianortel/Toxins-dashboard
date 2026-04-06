import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { EditorialTransition } from "@/components/landing/editorial-transition";
import { FeaturedCategories } from "@/components/landing/featured-categories";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { FeaturedCaseStudies } from "@/components/landing/featured-case-studies";
import { MethodologyPreview } from "@/components/landing/methodology-preview";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />

      <EditorialTransition
        quote="What is officially regulated does not always match what scientists, wildlife, and communities may already be signaling."
      />

      <FeaturedCategories />

      <StatisticsSection />

      <EditorialTransition
        quote="Wildlife often signals harm before policy catches up."
      />

      <FeaturedCaseStudies />

      <MethodologyPreview />

      <SiteFooter />
    </main>
  );
}
