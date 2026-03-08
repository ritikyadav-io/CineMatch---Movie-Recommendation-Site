import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { Button } from "@/components/ui/button";

const categoryLinks = [
  { label: "Hollywood", to: "/browse?cat=trending" },
  { label: "Bollywood", to: "/browse?cat=bollywood" },
  { label: "Superhero", to: "/browse?cat=superhero" },
  { label: "Anime", to: "/browse?cat=anime" },
  { label: "Sci-Fi", to: "/browse?cat=scifi" },
  { label: "Gaming", to: "/browse?cat=action" },
];

export function DNAHero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cinematic collage of Hollywood, Bollywood, Superhero, and Anime universes"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative flex h-full items-end pb-20 lg:items-center lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-5"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Now Streaming
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Discover Your
            <br />
            <span className="text-primary">Movies DNA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-lg text-base leading-relaxed text-secondary-foreground sm:text-lg"
          >
            Answer a few questions and find movies perfectly matched to your taste —
            from Hollywood blockbusters to Bollywood epics, superhero sagas to anime adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center gap-3 pt-2"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/quiz">
                <Play className="size-5 fill-current" />
                Discover By Mood
              </Link>
            </Button>
            <Button
              variant="heroSecondary"
              size="xl"
              onClick={() => {
                const cats = ["trending", "toprated", "popular", "bollywood", "superhero", "anime", "scifi", "horror", "series", "nowplaying"];
                const randomCat = cats[Math.floor(Math.random() * cats.length)];
                const randomPage = Math.floor(Math.random() * 5) + 1;
                window.location.href = `/browse?cat=${randomCat}&page=${randomPage}`;
              }}
            >
              <Info className="size-5" />
              Explore
            </Button>
          </motion.div>

          {/* Category tags — now clickable links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground"
          >
            <span className="font-semibold text-foreground">Categories:</span>
            {categoryLinks.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="rounded bg-secondary px-2 py-0.5 transition hover:bg-primary hover:text-primary-foreground"
              >
                {cat.label}
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
