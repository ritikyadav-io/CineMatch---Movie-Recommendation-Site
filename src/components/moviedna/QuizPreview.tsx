import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const sliders = [
  { label: "Romance", color: "bg-primary" },
  { label: "Action", color: "bg-orange-500" },
  { label: "Comedy", color: "bg-yellow-500" },
  { label: "Gore", color: "bg-red-800" },
  { label: "Emotional Intensity", color: "bg-accent" },
  { label: "Anime Preference", color: "bg-violet-500" },
  { label: "Superhero Interest", color: "bg-cyan-500" },
];

export function QuizPreview() {
  const [values, setValues] = useState<number[]>([65, 80, 45, 20, 70, 55, 90]);

  return (
    <section className="container py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground">Dial In Your Taste</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Slide each preference to build your unique movie profile.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-lg bg-card p-5 space-y-4 max-w-xl"
      >
        {sliders.map((slider, index) => (
          <div key={slider.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{slider.label}</span>
              <span className="text-muted-foreground">{values[index]}%</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${slider.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${values[index]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: "easeOut" }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={values[index]}
                onChange={(e) => {
                  const next = [...values];
                  next[index] = Number(e.target.value);
                  setValues(next);
                }}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
                aria-label={slider.label}
              />
            </div>
          </div>
        ))}
        <Button asChild variant="hero" size="sm" className="w-fit mt-2">
          <Link to="/quiz">
            Take the Quiz <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
