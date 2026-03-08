import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CoupleMode() {
  return (
    <section className="container py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="section-shell grid gap-10 lg:grid-cols-[1fr_1fr]"
        >
          {/* Visual */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute h-56 w-56 rounded-full bg-accent/20 blur-[80px]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-end gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex size-32 flex-col items-center justify-center rounded-[1.6rem] border border-border bg-card/80 shadow-poster sm:size-40"
              >
                <Users className="size-10 text-primary" />
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">Partner A</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-accent shadow-glow">
                  <Heart className="size-6 fill-accent-foreground text-accent-foreground" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex size-32 flex-col items-center justify-center rounded-[1.6rem] border border-border bg-card/80 shadow-poster sm:size-40"
              >
                <Users className="size-10 text-accent" />
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">Partner B</p>
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Couple Movie Mode</p>
            <h2 className="font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl">
              Date Night, Solved
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Both partners take the quiz independently. Movie DNA cross-references your
              taste profiles and surfaces movies that sit in the sweet spot of both
              preferences — no more 30-minute debates over what to watch.
            </p>
            <Button asChild variant="hero" size="xl" className="w-fit">
              <Link to="/quiz">
                <Heart className="size-4" />
                Try Couple Mode
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
