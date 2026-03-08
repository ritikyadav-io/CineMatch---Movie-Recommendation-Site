import { motion } from "framer-motion";
import { ArrowRight, Dna } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { Button } from "@/components/ui/button";

export function DNAHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cinematic collage of Hollywood, Bollywood, Superhero, and Anime universes"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Animated spotlight orbs */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-spotlight opacity-20 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] top-[30%] h-48 w-48 rounded-full bg-accent opacity-15 blur-[80px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Content */}
      <div className="container relative flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/60 px-5 py-2.5 text-xs uppercase tracking-[0.35em] text-primary shadow-glow backdrop-blur-md"
          >
            <Dna className="size-4" />
            Decode Your Movie Taste
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-5xl font-display text-6xl uppercase leading-[0.9] tracking-[0.06em] text-foreground sm:text-7xl lg:text-9xl"
          >
            Discover Your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Movie DNA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            Answer a few questions and find movies perfectly matched to your taste —
            from Hollywood blockbusters to Bollywood epics, superhero sagas to anime adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button asChild variant="hero" size="xl" className="group relative overflow-hidden">
              <Link to="/quiz">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                Start the Quiz
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="heroSecondary" size="xl">
              <Link to="/discover?section=trending">Explore Trending</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-12 w-7 rounded-full border-2 border-primary/40 p-1">
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
