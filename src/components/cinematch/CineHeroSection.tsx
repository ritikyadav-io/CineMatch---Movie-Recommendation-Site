import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/cinematch-hero.jpg";
import { Button } from "@/components/ui/button";

export function CineHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-hero" aria-hidden />
      <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_15%,hsl(var(--background))_78%)]" aria-hidden />
      <div className="spotlight-orb absolute left-[8%] top-16 hidden lg:block" aria-hidden />
      <div className="spotlight-orb absolute right-[10%] top-24 hidden lg:block [animation-delay:1.5s]" aria-hidden />

      <div className="container relative grid min-h-[78vh] items-end gap-14 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary shadow-poster backdrop-blur-sm">
            Spotlight-picked recommendations
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl font-display text-5xl uppercase leading-[0.88] tracking-[0.08em] text-foreground sm:text-6xl lg:text-8xl">
              Find Your Perfect Movie in 30 Seconds
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Answer a few questions and discover the best movies or series based on your taste.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/quiz">
                Start Movie Quiz
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="heroSecondary" size="xl">
              <Link to="/discover?section=trending">
                <PlayCircle className="size-4" />
                Explore Trending Movies
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[32rem] items-end justify-end lg:flex">
          <img
            src={heroImage}
            alt="A cinematic Hollywood stage with spotlights, velvet curtains, and film reels"
            className="w-full max-w-xl rounded-[2rem] border border-border/70 object-cover shadow-poster ring-1 ring-primary/20"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
