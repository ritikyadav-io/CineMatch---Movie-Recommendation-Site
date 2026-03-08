import { CTASection } from "@/components/moviedna/CTASection";
import { CoupleMode } from "@/components/moviedna/CoupleMode";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNAHero } from "@/components/moviedna/DNAHero";
import { DNANav } from "@/components/moviedna/DNANav";
import { FeatureCards } from "@/components/moviedna/FeatureCards";
import { MoviePersonality } from "@/components/moviedna/MoviePersonality";
import { QuizPreview } from "@/components/moviedna/QuizPreview";
import { TmdbRows } from "@/components/moviedna/TmdbRows";
import { TrailerPreview } from "@/components/moviedna/TrailerPreview";
import { UniverseShowcase } from "@/components/moviedna/UniverseShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main>
        <DNAHero />
        <TmdbRows />
        <FeatureCards />
        <QuizPreview />
        <UniverseShowcase />
        <TrailerPreview />
        <CoupleMode />
        <MoviePersonality />
        <CTASection />
      </main>
      <DNAFooter />
    </div>
  );
};

export default Index;
