import { motion } from "framer-motion";
import { ArrowRight, Dna } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-card/80 px-6 py-20 text-center shadow-glow backdrop-blur-sm sm:px-12 lg:py-28"
      >
        {/* Background glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex size-20 items-center justify-center rounded-full bg-spotlight shadow-glow"
          >
            <Dna className="size-10 text-primary-foreground" />
          </motion.div>

          <h2 className="mx-auto max-w-3xl font-display text-5xl uppercase tracking-[0.06em] sm:text-6xl lg:text-7xl">
            Unlock Your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Cinematic DNA
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Your perfect movie is waiting. Take the quiz, discover your taste profile,
            and never waste another movie night again.
          </p>

          <Button asChild variant="hero" size="xl" className="group">
            <Link to="/quiz">
              Start the Quiz
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
