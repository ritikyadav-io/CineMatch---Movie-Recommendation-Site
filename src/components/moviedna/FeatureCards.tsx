import { motion } from "framer-motion";
import { Brain, Dice5, Heart, Sparkles, Theater } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Personalized Movie Quiz",
    description: "Answer curated questions about your taste and get instant, tailored movie recommendations.",
  },
  {
    icon: Brain,
    title: "Mood-Based Movie Finder",
    description: "Tell us your mood and we'll surface the perfect film to match how you're feeling right now.",
  },
  {
    icon: Heart,
    title: "Couple Movie Mode",
    description: "Both partners take the quiz — we find the movie you'll both love for date night.",
  },
  {
    icon: Theater,
    title: "Movie Personality Type",
    description: "Discover if you're an Action Addict, Romantic Dreamer, Sci-Fi Explorer, or Anime Enthusiast.",
  },
  {
    icon: Dice5,
    title: "Random Movie Night",
    description: "Can't decide? Hit the random button and let fate choose your next cinematic adventure.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function FeatureCards() {
  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-primary">How It Works</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
          Five Ways to Discover
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Movie DNA gives you multiple paths to your next obsession — from scientific taste-matching to pure serendipity.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-poster backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/80 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
