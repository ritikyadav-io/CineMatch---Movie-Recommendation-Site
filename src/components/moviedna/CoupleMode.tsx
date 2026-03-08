import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CoupleMode() {
  return (
    <section className="container py-12 lg:py-16">
      <div className="rounded-lg bg-card overflow-hidden lg:grid lg:grid-cols-2">
        {/* Visual */}
        <div className="relative flex items-center justify-center py-16 bg-gradient-to-br from-primary/10 via-card to-accent/10">
          <div className="flex items-end gap-8">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex size-28 flex-col items-center justify-center rounded-lg bg-secondary sm:size-32"
            >
              <Users className="size-8 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Partner A</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary">
                <Heart className="size-5 fill-primary-foreground text-primary-foreground" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex size-28 flex-col items-center justify-center rounded-lg bg-secondary sm:size-32"
            >
              <Users className="size-8 text-accent" />
              <p className="mt-2 text-xs text-muted-foreground">Partner B</p>
            </motion.div>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center p-8 lg:p-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Couple Mode</span>
          <h2 className="text-3xl font-bold text-foreground">
            Date Night, Solved
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Both partners take the quiz independently. Movie DNA cross-references your
            taste profiles and finds movies in the sweet spot — no more 30-minute debates.
          </p>
          <Button asChild variant="hero" size="default" className="w-fit">
            <Link to="/quiz">
              <Heart className="size-4" />
              Try Couple Mode
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
