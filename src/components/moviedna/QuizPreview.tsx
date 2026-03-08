import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
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

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Sliders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-card p-5 space-y-4"
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
        </motion.div>

        {/* Sample result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-lg bg-card p-5 flex flex-col justify-center space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Sample Result</span>
          <div className="overflow-hidden rounded-lg bg-muted aspect-video" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded bg-primary/20 px-3 py-1 text-xs font-bold text-primary">92% Match</span>
              <span className="flex items-center gap-1 text-sm text-foreground">
                <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                8.6
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Inception</h3>
            <div className="flex gap-2">
              {["Action", "Sci-Fi", "Thriller"].map((g) => (
                <span key={g} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{g}</span>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your high action and mind-bending preferences perfectly align with this dream-heist masterpiece.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
