import { motion } from "framer-motion";
import { Brain, Dice5, Heart, Sparkles, Theater } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sparkles,
    title: "Personalized Quiz",
    description: "Curated questions to decode your taste and deliver instant recommendations.",
    to: "/quiz",
  },
  {
    icon: Brain,
    title: "Mood Finder",
    description: "Tell us your mood — we surface the perfect film to match.",
    to: "/discover",
  },
  {
    icon: Heart,
    title: "Couple Mode",
    description: "Both partners take the quiz. We find what you'll both love.",
    to: "/quiz",
  },
  {
    icon: Theater,
    title: "Personality Type",
    description: "Discover your cinematic identity: Action Addict, Dreamer, Explorer.",
    to: "/quiz",
  },
  {
    icon: Dice5,
    title: "Random Night",
    description: "Can't decide? Let fate choose your next movie adventure.",
    to: "/browse?cat=trending",
  },
];

export function FeatureCards() {
  return (
    <section className="container py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link
              to={feature.to}
              className="group block rounded-lg bg-card p-5 transition-all duration-300 hover:bg-secondary hover:scale-[1.02]"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
