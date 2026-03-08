import { CategoryBar } from "@/components/moviedna/CategoryBar";
import { CTASection } from "@/components/moviedna/CTASection";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNAHero } from "@/components/moviedna/DNAHero";
import { DNANav } from "@/components/moviedna/DNANav";
import { MoviePersonality } from "@/components/moviedna/MoviePersonality";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <DNAHero />
      <CategoryBar />
      <MoviePersonality />
      <CTASection />
      <DNAFooter />
    </div>
  );
};

export default Index;
