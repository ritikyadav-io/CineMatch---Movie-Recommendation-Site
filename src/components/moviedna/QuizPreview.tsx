import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

const sliders = [
  { label: "Romance", color: "from-pink-500 to-rose-500" },
  { label: "Action", color: "from-orange-500 to-red-500" },
  { label: "Comedy", color: "from-yellow-500 to-amber-500" },
  { label: "Gore", color: "from-red-700 to-red-900" },
  { label: "Emotional Intensity", color: "from-blue-400 to-indigo-500" },
  { label: "Anime Preference", color: "from-violet-500 to-purple-500" },
  { label: "Superhero Interest", color: "from-cyan-400 to-blue-500" },
];

export function QuizPreview() {
  const [values, setValues] = useState<number[]>([65, 80, 45, 20, 70, 55, 90]);

  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Quiz Preview</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
          Dial In Your Taste
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Slide each preference to build your unique movie profile. Here's a taste of how it works.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Sliders */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-shell space-y-5"
        >
          {sliders.map((slider, index) => (
            <div key={slider.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{slider.label}</span>
                <span className="text-xs text-muted-foreground">{values[index]}%</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${slider.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${values[index]}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
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

        {/* Sample result card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="section-shell flex flex-col justify-center space-y-6"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Sample Result</p>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/50">
            <div className="aspect-[16/9] bg-gradient-to-br from-secondary via-muted to-card" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary">
                92% Match
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground">
                <Star className="size-4 fill-primary text-primary" />
                8.6
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Inception</h3>
            <div className="flex flex-wrap gap-2">
              {["Action", "Sci-Fi", "Thriller"].map((g) => (
                <span key={g} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">{g}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your high action and mind-bending preferences perfectly align with this dream-heist masterpiece. The complex layered narrative matches your taste for thought-provoking storytelling.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
