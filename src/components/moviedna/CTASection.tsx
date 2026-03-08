import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="container py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 via-card to-accent/10 px-6 py-16 text-center sm:px-12 lg:py-20"
      >
        <div className="relative space-y-6">
          <h2 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Unlock Your <span className="text-primary">Cinematic DNA</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Your perfect movie is waiting. Take the quiz, discover your taste profile,
            and never waste another movie night.
          </p>
          <Button asChild variant="hero" size="xl" className="group">
            <Link to="/quiz">
              Start the Quiz
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
